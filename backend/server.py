from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import base64
from emergentintegrations.llm.openai import OpenAITextToSpeech


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class TTSRequest(BaseModel):
    text: str = Field(..., max_length=4096, description="Text to convert to speech")
    language: str = Field(default="en", description="Language code: en or ta")
    speed: Optional[float] = Field(default=1.0, ge=0.5, le=2.0, description="Speech speed")
    voice: Optional[str] = Field(default="alloy", description="Voice to use")

class TTSResponse(BaseModel):
    audio_base64: str
    format: str = "mp3"

# Course Models
class Course(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    name_tamil: str
    description: str
    description_tamil: str
    icon: str
    color: str
    lesson_count: int = 0

class Transcription(BaseModel):
    language: str  # 'en' or 'ta'
    text: str
    timestamps: Optional[List[dict]] = None

class Lesson(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    course_id: str
    title: str
    title_tamil: str
    description: str
    description_tamil: str
    video_url: str
    video_duration: Optional[int] = None  # in seconds
    transcriptions: List[Transcription]
    content_text: str  # Full text content for TTS
    content_text_tamil: str
    order: int = 0

class LessonProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lesson_id: str
    user_id: str = "guest"  # For future user tracking
    completed: bool = False
    progress_seconds: int = 0
    last_accessed: datetime = Field(default_factory=datetime.utcnow)

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/tts", response_model=TTSResponse)
async def text_to_speech(request: TTSRequest):
    """
    Convert text to speech using OpenAI TTS.
    Supports English (en) and Tamil (ta) languages.
    Returns base64 encoded MP3 audio.
    """
    try:
        # Initialize TTS client
        api_key = os.getenv("EMERGENT_LLM_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="TTS API key not configured")
        
        tts = OpenAITextToSpeech(api_key=api_key)
        
        # Select appropriate voice based on language
        voice_map = {
            "en": "alloy",  # Clear, neutral voice for English
            "ta": "nova",   # Energetic voice works well for Tamil
        }
        voice = request.voice or voice_map.get(request.language, "alloy")
        
        # Generate speech with base64 output
        audio_base64 = await tts.generate_speech_base64(
            text=request.text,
            model="tts-1",  # Fast model for real-time use
            voice=voice,
            speed=request.speed,
            response_format="mp3"
        )
        
        logger.info(f"Generated TTS for {len(request.text)} chars in {request.language}")
        
        return TTSResponse(
            audio_base64=audio_base64,
            format="mp3"
        )
        
    except ValueError as e:
        logger.error(f"TTS validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"TTS generation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate speech")

# Course Endpoints
@api_router.get("/courses", response_model=List[Course])
async def get_courses():
    """Get all available courses"""
    try:
        courses = await db.courses.find().to_list(100)
        
        # If no courses exist, seed sample data
        if not courses:
            await seed_course_data()
            courses = await db.courses.find().to_list(100)
        
        return [Course(**course) for course in courses]
    except Exception as e:
        logger.error(f"Failed to fetch courses: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch courses")

@api_router.get("/courses/{course_id}", response_model=Course)
async def get_course(course_id: str):
    """Get specific course details"""
    course = await db.courses.find_one({"id": course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return Course(**course)

@api_router.get("/courses/{course_id}/lessons", response_model=List[Lesson])
async def get_course_lessons(course_id: str):
    """Get all lessons for a specific course"""
    try:
        lessons = await db.lessons.find({"course_id": course_id}).sort("order", 1).to_list(100)
        return [Lesson(**lesson) for lesson in lessons]
    except Exception as e:
        logger.error(f"Failed to fetch lessons: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch lessons")

@api_router.get("/lessons/{lesson_id}", response_model=Lesson)
async def get_lesson(lesson_id: str):
    """Get specific lesson details with video and transcription"""
    lesson = await db.lessons.find_one({"id": lesson_id})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return Lesson(**lesson)

# Helper function to seed sample course data
async def seed_course_data():
    """Seed sample courses and lessons into the database"""
    
    # Sample courses
    courses = [
        {
            "id": "course-maths",
            "name": "Mathematics",
            "name_tamil": "கணிதம்",
            "description": "Learn fundamental mathematics concepts",
            "description_tamil": "அடிப்படை கணித கருத்துக்களை கற்றுக்கொள்ளுங்கள்",
            "icon": "calculator",
            "color": "blue",
            "lesson_count": 3
        },
        {
            "id": "course-science",
            "name": "Science",
            "name_tamil": "அறிவியல்",
            "description": "Explore the wonders of science",
            "description_tamil": "அறிவியலின் அதிசயங்களை ஆராயுங்கள்",
            "icon": "microscope",
            "color": "green",
            "lesson_count": 3
        },
        {
            "id": "course-english",
            "name": "English",
            "name_tamil": "ஆங்கிலம்",
            "description": "Master English language skills",
            "description_tamil": "ஆங்கில மொழி திறன்களை மேம்படுத்துங்கள்",
            "icon": "book",
            "color": "purple",
            "lesson_count": 3
        },
        {
            "id": "course-tamil",
            "name": "Tamil",
            "name_tamil": "தமிழ்",
            "description": "Learn and celebrate Tamil language",
            "description_tamil": "தமிழ் மொழியை கற்றுக்கொள்ளுங்கள்",
            "icon": "book-open",
            "color": "orange",
            "lesson_count": 3
        }
    ]
    
    # Sample lessons for Mathematics
    maths_lessons = [
        {
            "id": "lesson-maths-1",
            "course_id": "course-maths",
            "title": "Introduction to Numbers",
            "title_tamil": "எண்களின் அறிமுகம்",
            "description": "Learn about basic numbers and counting",
            "description_tamil": "அடிப்படை எண்கள் மற்றும் எண்ணுதல் பற்றி அறியுங்கள்",
            "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "video_duration": 180,
            "transcriptions": [
                {
                    "language": "en",
                    "text": "Welcome to our lesson on numbers. Numbers are fundamental to mathematics. We use them every day for counting, measuring, and solving problems. Let's start with natural numbers: 1, 2, 3, 4, 5. These are the numbers we use to count objects."
                },
                {
                    "language": "ta",
                    "text": "எண்கள் பாடத்திற்கு வரவேற்கிறோம். எண்கள் கணிதத்தின் அடிப்படையாகும். நாம் ஒவ்வொரு நாளும் எண்ணுதல், அளவிடுதல் மற்றும் சிக்கல்களை தீர்க்க அவற்றைப் பயன்படுத்துகிறோம். இயற்கை எண்களுடன் தொடங்குவோம்: 1, 2, 3, 4, 5."
                }
            ],
            "content_text": "Numbers are the building blocks of mathematics. In this lesson, we will explore natural numbers, whole numbers, and integers. Natural numbers start from 1 and go on infinitely. Whole numbers include 0 along with natural numbers. Integers include both positive and negative numbers.",
            "content_text_tamil": "எண்கள் கணிதத்தின் கட்டுமானத் தொகுதிகள். இந்த பாடத்தில், இயற்கை எண்கள், முழு எண்கள் மற்றும் முழு எண்களை ஆராய்வோம்.",
            "order": 1
        },
        {
            "id": "lesson-maths-2",
            "course_id": "course-maths",
            "title": "Addition and Subtraction",
            "title_tamil": "கூட்டல் மற்றும் கழித்தல்",
            "description": "Master basic arithmetic operations",
            "description_tamil": "அடிப்படை எண்கணித செயல்பாடுகளை கற்றுக்கொள்ளுங்கள்",
            "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "video_duration": 240,
            "transcriptions": [
                {
                    "language": "en",
                    "text": "Addition is combining two or more numbers to get a sum. For example, 2 plus 3 equals 5. Subtraction is taking away one number from another. For example, 5 minus 2 equals 3."
                },
                {
                    "language": "ta",
                    "text": "கூட்டல் என்பது இரண்டு அல்லது அதற்கு மேற்பட்ட எண்களை சேர்த்து கூட்டுத்தொகையை பெறுவதாகும். எடுத்துக்காட்டாக, 2 கூட்டல் 3 சமம் 5."
                }
            ],
            "content_text": "Addition and subtraction are fundamental arithmetic operations. Addition combines quantities, while subtraction finds the difference. Practice with simple examples: 1+1=2, 5-3=2, 10+5=15.",
            "content_text_tamil": "கூட்டல் மற்றும் கழித்தல் அடிப்படை எண்கணித செயல்பாடுகள். எளிய எடுத்துக்காட்டுகளுடன் பயிற்சி செய்யுங்கள்.",
            "order": 2
        },
        {
            "id": "lesson-maths-3",
            "course_id": "course-maths",
            "title": "Multiplication Basics",
            "title_tamil": "பெருக்கல் அடிப்படைகள்",
            "description": "Learn multiplication tables and concepts",
            "description_tamil": "பெருக்கல் அட்டவணைகள் மற்றும் கருத்துக்களை கற்றுக்கொள்ளுங்கள்",
            "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "video_duration": 300,
            "transcriptions": [
                {
                    "language": "en",
                    "text": "Multiplication is repeated addition. When we say 3 times 4, we mean adding 3 four times: 3+3+3+3 equals 12. Learning multiplication tables helps us calculate faster."
                },
                {
                    "language": "ta",
                    "text": "பெருக்கல் என்பது மீண்டும் மீண்டும் கூட்டல் ஆகும். 3 பெருக்கல் 4 என்றால், 3ஐ நான்கு முறை சேர்ப்பது: 3+3+3+3 சமம் 12."
                }
            ],
            "content_text": "Multiplication is a shortcut for repeated addition. Master the multiplication tables from 1 to 10. Understanding patterns in multiplication helps solve problems quickly. 2×3=6, 5×5=25, 10×10=100.",
            "content_text_tamil": "பெருக்கல் என்பது மீண்டும் மீண்டும் கூட்டலுக்கான குறுக்குவழி. 1 முதல் 10 வரையிலான பெருக்கல் அட்டவணைகளை மாஸ்டர் செய்யுங்கள்.",
            "order": 3
        }
    ]
    
    # Sample lessons for Science
    science_lessons = [
        {
            "id": "lesson-science-1",
            "course_id": "course-science",
            "title": "What is Science?",
            "title_tamil": "அறிவியல் என்றால் என்ன?",
            "description": "Introduction to scientific thinking",
            "description_tamil": "அறிவியல் சிந்தனையின் அறிமுகம்",
            "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "video_duration": 200,
            "transcriptions": [
                {
                    "language": "en",
                    "text": "Science is the study of the natural world through observation and experiment. Scientists ask questions, make predictions, and test their ideas. Science helps us understand everything around us."
                },
                {
                    "language": "ta",
                    "text": "அறிவியல் என்பது கவனிப்பு மற்றும் சோதனை மூலம் இயற்கை உலகின் ஆய்வு ஆகும். விஞ்ஞானிகள் கேள்விகளைக் கேட்கிறார்கள், கணிப்புகளை செய்கிறார்கள்."
                }
            ],
            "content_text": "Science is a systematic way of learning about the world. It uses observation, experimentation, and logical thinking. The scientific method includes: asking questions, forming hypotheses, conducting experiments, analyzing results, and drawing conclusions.",
            "content_text_tamil": "அறிவியல் என்பது உலகத்தைப் பற்றி கற்றுக்கொள்வதற்கான ஒரு முறையான வழி. இது கவனிப்பு, பரிசோதனை மற்றும் தர்க்க சிந்தனையைப் பயன்படுத்துகிறது.",
            "order": 1
        },
        {
            "id": "lesson-science-2",
            "course_id": "course-science",
            "title": "Plants and Animals",
            "title_tamil": "தாவரங்கள் மற்றும் விலங்குகள்",
            "description": "Explore living organisms",
            "description_tamil": "உயிரினங்களை ஆராயுங்கள்",
            "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "video_duration": 220,
            "transcriptions": [
                {
                    "language": "en",
                    "text": "Living things include plants and animals. Plants make their own food using sunlight. Animals need to eat plants or other animals. Both plants and animals need water, air, and a place to live."
                },
                {
                    "language": "ta",
                    "text": "உயிரினங்களில் தாவரங்கள் மற்றும் விலங்குகள் அடங்கும். தாவரங்கள் சூரிய ஒளியைப் பயன்படுத்தி தங்கள் சொந்த உணவை உற்பத்தி செய்கின்றன."
                }
            ],
            "content_text": "Living organisms are classified into plants and animals. Plants perform photosynthesis to make food. Animals are mobile and consume other organisms. Both respond to their environment and can reproduce.",
            "content_text_tamil": "உயிரினங்கள் தாவரங்கள் மற்றும் விலங்குகளாக வகைப்படுத்தப்படுகின்றன. தாவரங்கள் ஒளிச்சேர்க்கை செய்து உணவை உருவாக்குகின்றன.",
            "order": 2
        },
        {
            "id": "lesson-science-3",
            "course_id": "course-science",
            "title": "The Water Cycle",
            "title_tamil": "நீர் சுழற்சி",
            "description": "Understanding Earth's water system",
            "description_tamil": "பூமியின் நீர் அமைப்பைப் புரிந்துகொள்வது",
            "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "video_duration": 250,
            "transcriptions": [
                {
                    "language": "en",
                    "text": "The water cycle describes how water moves on Earth. Water evaporates from oceans and lakes, forms clouds, falls as rain, and flows back to the ocean. This cycle continues forever."
                },
                {
                    "language": "ta",
                    "text": "நீர் சுழற்சி பூமியில் நீர் எவ்வாறு நகர்கிறது என்பதை விவரிக்கிறது. கடல்கள் மற்றும் ஏரிகளிலிருந்து நீர் ஆவியாகிறது, மேகங்களை உருவாக்குகிறது."
                }
            ],
            "content_text": "The water cycle, also known as the hydrologic cycle, describes the continuous movement of water on Earth. Stages include: evaporation, condensation, precipitation, and collection. This cycle is essential for life on Earth.",
            "content_text_tamil": "நீர் சுழற்சி, நீரியல் சுழற்சி என்றும் அழைக்கப்படுகிறது, பூமியில் நீரின் தொடர்ச்சியான இயக்கத்தை விவரிக்கிறது.",
            "order": 3
        }
    ]
    
    # Insert courses
    await db.courses.insert_many(courses)
    
    # Insert lessons
    await db.lessons.insert_many(maths_lessons + science_lessons)
    
    logger.info("Sample course data seeded successfully")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
