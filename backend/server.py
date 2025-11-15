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
