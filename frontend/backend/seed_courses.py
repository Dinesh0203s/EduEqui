"""
Script to seed the database with courses for all subjects
Run this script to populate the database with sample course data
"""
import sys
import os
from datetime import datetime

# Fix Unicode encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Add the current directory to the path so we can import models
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models import CourseModel, LessonModel, db

def seed_courses():
    """Seed the database with courses for all subjects"""
    
    # Clear existing courses and lessons
    print("Clearing existing courses and lessons...")
    db['courses'].delete_many({})
    db['lessons'].delete_many({})
    
    courses_data = [
        {
            'title': 'Mathematics',
            'titleTamil': 'கணிதம்',
            'description': 'Learn fundamental mathematics including arithmetic, algebra, geometry, and problem-solving skills.',
            'descriptionTamil': 'எண்கணிதம், இயற்கணிதம், வடிவியல் மற்றும் சிக்கல் தீர்வு திறன்கள் உட்பட அடிப்படை கணிதத்தைக் கற்றுக்கொள்ளுங்கள்.',
            'difficulty': 'Beginner',
            'category': 'Mathematics',
            'lessons': [
                {
                    'title': 'Introduction to Numbers',
                    'titleTamil': 'எண்களின் அறிமுகம்',
                    'content': 'Numbers are the foundation of mathematics. We use numbers to count, measure, and solve problems. In this lesson, you will learn about whole numbers, counting from 1 to 100, and basic number operations.',
                    'contentTamil': 'எண்கள் கணிதத்தின் அடித்தளம். எண்ண, அளவிட மற்றும் சிக்கல்களைத் தீர்க்க எண்களைப் பயன்படுத்துகிறோம். இந்த பாடத்தில், முழு எண்கள், 1 முதல் 100 வரை எண்ணுதல் மற்றும் அடிப்படை எண் செயல்பாடுகள் பற்றி நீங்கள் கற்றுக்கொள்வீர்கள்.',
                    'order': 1
                },
                {
                    'title': 'Addition and Subtraction',
                    'titleTamil': 'கூட்டல் மற்றும் கழித்தல்',
                    'content': 'Addition means putting numbers together to get a total. Subtraction means taking away from a number. Practice adding and subtracting single-digit and double-digit numbers.',
                    'contentTamil': 'கூட்டல் என்பது மொத்தத்தைப் பெற எண்களை ஒன்றாக இணைப்பதாகும். கழித்தல் என்பது ஒரு எண்ணிலிருந்து எடுப்பதாகும். ஒற்றை இலக்கம் மற்றும் இரட்டை இலக்க எண்களைக் கூட்டுதல் மற்றும் கழித்தல் பயிற்சி செய்யுங்கள்.',
                    'order': 2
                },
                {
                    'title': 'Multiplication Basics',
                    'titleTamil': 'பெருக்கலின் அடிப்படைகள்',
                    'content': 'Multiplication is a quick way to add the same number many times. Learn the multiplication tables from 1 to 10 and practice solving multiplication problems.',
                    'contentTamil': 'பெருக்கல் என்பது ஒரே எண்ணை பல முறை சேர்ப்பதற்கான விரைவான வழியாகும். 1 முதல் 10 வரையிலான பெருக்கல் அட்டவணைகளைக் கற்றுக்கொண்டு பெருக்கல் சிக்கல்களைத் தீர்ப்பதில் பயிற்சி செய்யுங்கள்.',
                    'order': 3
                },
                {
                    'title': 'Introduction to Geometry',
                    'titleTamil': 'வடிவியலின் அறிமுகம்',
                    'content': 'Geometry is the study of shapes and sizes. Learn about basic shapes like circles, squares, triangles, and rectangles. Understand concepts like area and perimeter.',
                    'contentTamil': 'வடிவியல் என்பது வடிவங்கள் மற்றும் அளவுகளின் ஆய்வு. வட்டங்கள், சதுரங்கள், முக்கோணங்கள் மற்றும் செவ்வகங்கள் போன்ற அடிப்படை வடிவங்களைக் கற்றுக்கொள்ளுங்கள். பரப்பளவு மற்றும் சுற்றளவு போன்ற கருத்துக்களைப் புரிந்து கொள்ளுங்கள்.',
                    'order': 4
                }
            ]
        },
        {
            'title': 'Science',
            'titleTamil': 'அறிவியல்',
            'description': 'Explore the natural world through physics, chemistry, biology, and environmental science. Learn about living things, matter, energy, and the environment.',
            'descriptionTamil': 'இயற்பியல், வேதியியல், உயிரியல் மற்றும் சுற்றுச்சூழல் அறிவியல் மூலம் இயற்கை உலகை ஆராயுங்கள். உயிரினங்கள், பொருள், ஆற்றல் மற்றும் சுற்றுச்சூழல் பற்றி அறிக.',
            'difficulty': 'Beginner',
            'category': 'Science',
            'lessons': [
                {
                    'title': 'Living and Non-Living Things',
                    'titleTamil': 'உயிரினங்கள் மற்றும் உயிரற்ற பொருட்கள்',
                    'content': 'Everything around us can be classified as living or non-living. Living things grow, reproduce, need food and water, and respond to their environment. Learn to identify and classify different objects.',
                    'contentTamil': 'நம்மைச் சுற்றியுள்ள அனைத்தும் உயிரினங்கள் அல்லது உயிரற்ற பொருட்களாக வகைப்படுத்தப்படலாம். உயிரினங்கள் வளரும், இனப்பெருக்கம் செய்யும், உணவு மற்றும் நீர் தேவைப்படும், மற்றும் அவற்றின் சூழலுக்கு பதிலளிக்கும். வெவ்வேறு பொருள்களை அடையாளம் கண்டு வகைப்படுத்த கற்றுக்கொள்ளுங்கள்.',
                    'order': 1
                },
                {
                    'title': 'The Human Body',
                    'titleTamil': 'மனித உடல்',
                    'content': 'The human body is made up of many parts that work together. Learn about the main body systems: skeletal system, muscular system, digestive system, respiratory system, and circulatory system.',
                    'contentTamil': 'மனித உடல் ஒன்றாக வேலை செய்யும் பல பகுதிகளால் ஆனது. முக்கிய உடல் அமைப்புகளைப் பற்றி அறிக: எலும்பு மண்டலம், தசை அமைப்பு, செரிமான அமைப்பு, சுவாச அமைப்பு மற்றும் இரத்த சுழற்சி அமைப்பு.',
                    'order': 2
                },
                {
                    'title': 'Plants and Their Parts',
                    'titleTamil': 'தாவரங்கள் மற்றும் அவற்றின் பகுதிகள்',
                    'content': 'Plants are living things that make their own food. Learn about the different parts of a plant: roots, stem, leaves, flowers, and fruits. Understand how plants grow and what they need to survive.',
                    'contentTamil': 'தாவரங்கள் தங்கள் சொந்த உணவை உருவாக்கும் உயிரினங்கள். தாவரத்தின் வெவ்வேறு பகுதிகளைப் பற்றி அறிக: வேர்கள், தண்டு, இலைகள், பூக்கள் மற்றும் பழங்கள். தாவரங்கள் எவ்வாறு வளருகின்றன மற்றும் அவை உயிர்வாழ என்ன தேவை என்பதைப் புரிந்து கொள்ளுங்கள்.',
                    'order': 3
                },
                {
                    'title': 'Water Cycle',
                    'titleTamil': 'நீர் சுழற்சி',
                    'content': 'Water moves in a continuous cycle on Earth. Learn about evaporation, condensation, precipitation, and collection. Understand how water changes from liquid to gas and back to liquid.',
                    'contentTamil': 'நீர் பூமியில் தொடர்ச்சியான சுழற்சியில் நகர்கிறது. ஆவியாதல், ஒடுக்கம், மழைப்பொழிவு மற்றும் சேகரிப்பு பற்றி அறிக. நீர் எவ்வாறு திரவத்திலிருந்து வாயுவாகவும் மீண்டும் திரவமாகவும் மாறுகிறது என்பதைப் புரிந்து கொள்ளுங்கள்.',
                    'order': 4
                }
            ]
        },
        {
            'title': 'English Language',
            'titleTamil': 'ஆங்கில மொழி',
            'description': 'Improve your English reading, writing, speaking, and listening skills. Learn grammar, vocabulary, comprehension, and communication.',
            'descriptionTamil': 'உங்கள் ஆங்கில வாசிப்பு, எழுதுதல், பேசுதல் மற்றும் கேட்கும் திறன்களை மேம்படுத்துங்கள். இலக்கணம், சொற்களஞ்சியம், புரிதல் மற்றும் தொடர்பு பற்றி அறிக.',
            'difficulty': 'Beginner',
            'category': 'Language',
            'lessons': [
                {
                    'title': 'Alphabet and Sounds',
                    'titleTamil': 'எழுத்துக்கள் மற்றும் ஒலிகள்',
                    'content': 'The English alphabet has 26 letters. Each letter has a name and makes sounds. Learn to recognize letters, their sounds, and how to form words. Practice reading simple words.',
                    'contentTamil': 'ஆங்கில எழுத்துக்கள் 26 எழுத்துக்களைக் கொண்டுள்ளன. ஒவ்வொரு எழுத்துக்கும் ஒரு பெயர் உள்ளது மற்றும் ஒலிகளை உருவாக்குகிறது. எழுத்துக்களை அடையாளம் காண, அவற்றின் ஒலிகள் மற்றும் சொற்களை எவ்வாறு உருவாக்குவது என்பதைக் கற்றுக்கொள்ளுங்கள். எளிய சொற்களைப் படிக்க பயிற்சி செய்யுங்கள்.',
                    'order': 1
                },
                {
                    'title': 'Basic Grammar',
                    'titleTamil': 'அடிப்படை இலக்கணம்',
                    'content': 'Grammar helps us form correct sentences. Learn about nouns (names of people, places, things), verbs (action words), adjectives (describing words), and how to make simple sentences.',
                    'contentTamil': 'இலக்கணம் சரியான வாக்கியங்களை உருவாக்க உதவுகிறது. பெயர்ச்சொற்கள் (மக்கள், இடங்கள், விஷயங்களின் பெயர்கள்), வினைச்சொற்கள் (செயல் சொற்கள்), பெயரடைகள் (விவரிக்கும் சொற்கள்) மற்றும் எளிய வாக்கியங்களை எவ்வாறு உருவாக்குவது என்பதைக் கற்றுக்கொள்ளுங்கள்.',
                    'order': 2
                },
                {
                    'title': 'Reading Comprehension',
                    'titleTamil': 'வாசிப்பு புரிதல்',
                    'content': 'Reading comprehension means understanding what you read. Practice reading short stories and answering questions about them. Learn to identify the main idea and details.',
                    'contentTamil': 'வாசிப்பு புரிதல் என்பது நீங்கள் படிப்பதைப் புரிந்து கொள்வதாகும். குறுகிய கதைகளைப் படித்து அவற்றைப் பற்றிய கேள்விகளுக்கு பதிலளிக்க பயிற்சி செய்யுங்கள். முக்கிய யோசனை மற்றும் விவரங்களை அடையாளம் காண கற்றுக்கொள்ளுங்கள்.',
                    'order': 3
                },
                {
                    'title': 'Writing Skills',
                    'titleTamil': 'எழுதும் திறன்கள்',
                    'content': 'Writing is a way to express your thoughts. Learn to write simple sentences, paragraphs, and short stories. Practice proper spelling, punctuation, and sentence structure.',
                    'contentTamil': 'எழுதுதல் என்பது உங்கள் எண்ணங்களை வெளிப்படுத்துவதற்கான ஒரு வழியாகும். எளிய வாக்கியங்கள், பத்திகள் மற்றும் குறுகிய கதைகளை எழுத கற்றுக்கொள்ளுங்கள். சரியான எழுத்துப்பிழை, நிறுத்தற்குறிகள் மற்றும் வாக்கிய அமைப்பை பயிற்சி செய்யுங்கள்.',
                    'order': 4
                }
            ]
        },
        {
            'title': 'Tamil Language',
            'titleTamil': 'தமிழ் மொழி',
            'description': 'Learn Tamil language including reading, writing, grammar, and literature. Explore Tamil culture and traditions through language learning.',
            'descriptionTamil': 'வாசிப்பு, எழுதுதல், இலக்கணம் மற்றும் இலக்கியம் உட்பட தமிழ் மொழியைக் கற்றுக்கொள்ளுங்கள். மொழி கற்றல் மூலம் தமிழ் கலாச்சாரம் மற்றும் பாரம்பரியங்களை ஆராயுங்கள்.',
            'difficulty': 'Beginner',
            'category': 'Language',
            'lessons': [
                {
                    'title': 'Tamil Letters (உயிர் எழுத்துக்கள்)',
                    'titleTamil': 'தமிழ் எழுத்துக்கள் (உயிர் எழுத்துக்கள்)',
                    'content': 'Tamil has 12 vowels (உயிர் எழுத்துக்கள்) and 18 consonants (மெய் எழுத்துக்கள்). Learn to recognize and write Tamil letters. Practice reading and writing simple Tamil words.',
                    'contentTamil': 'தமிழில் 12 உயிரெழுத்துக்கள் மற்றும் 18 மெய்யெழுத்துக்கள் உள்ளன. தமிழ் எழுத்துக்களை அடையாளம் கண்டு எழுத கற்றுக்கொள்ளுங்கள். எளிய தமிழ் சொற்களைப் படித்து எழுத பயிற்சி செய்யுங்கள்.',
                    'order': 1
                },
                {
                    'title': 'Tamil Grammar Basics',
                    'titleTamil': 'தமிழ் இலக்கண அடிப்படைகள்',
                    'content': 'Learn Tamil grammar including nouns (பெயர்ச்சொல்), verbs (வினைச்சொல்), and sentence structure. Understand how to form correct Tamil sentences and use proper grammar rules.',
                    'contentTamil': 'பெயர்ச்சொல், வினைச்சொல் மற்றும் வாக்கிய அமைப்பு உட்பட தமிழ் இலக்கணத்தைக் கற்றுக்கொள்ளுங்கள். சரியான தமிழ் வாக்கியங்களை எவ்வாறு உருவாக்குவது மற்றும் சரியான இலக்கண விதிகளைப் பயன்படுத்துவது என்பதைப் புரிந்து கொள்ளுங்கள்.',
                    'order': 2
                },
                {
                    'title': 'Tamil Poetry and Literature',
                    'titleTamil': 'தமிழ் கவிதை மற்றும் இலக்கியம்',
                    'content': 'Explore Tamil poetry and literature. Learn about famous Tamil poets and their works. Read and understand simple Tamil poems and stories.',
                    'contentTamil': 'தமிழ் கவிதை மற்றும் இலக்கியத்தை ஆராயுங்கள். பிரபல தமிழ் கவிஞர்கள் மற்றும் அவர்களின் படைப்புகளைப் பற்றி அறிக. எளிய தமிழ் கவிதைகள் மற்றும் கதைகளைப் படித்து புரிந்து கொள்ளுங்கள்.',
                    'order': 3
                },
                {
                    'title': 'Tamil Culture and Traditions',
                    'titleTamil': 'தமிழ் கலாச்சாரம் மற்றும் பாரம்பரியங்கள்',
                    'content': 'Learn about Tamil culture, festivals, traditions, and customs. Understand the rich heritage of Tamil people and their way of life.',
                    'contentTamil': 'தமிழ் கலாச்சாரம், திருவிழாக்கள், பாரம்பரியங்கள் மற்றும் பழக்கவழக்கங்களைப் பற்றி அறிக. தமிழ் மக்களின் பணக்கார பாரம்பரியம் மற்றும் அவர்களின் வாழ்க்கை முறையைப் புரிந்து கொள்ளுங்கள்.',
                    'order': 4
                }
            ]
        },
        {
            'title': 'Social Studies',
            'titleTamil': 'சமூக அறிவியல்',
            'description': 'Learn about history, geography, civics, and culture. Understand the world around you, different countries, and how societies work.',
            'descriptionTamil': 'வரலாறு, புவியியல், குடியியல் மற்றும் கலாச்சாரம் பற்றி அறிக. உங்களைச் சுற்றியுள்ள உலகம், வெவ்வேறு நாடுகள் மற்றும் சமூகங்கள் எவ்வாறு செயல்படுகின்றன என்பதைப் புரிந்து கொள்ளுங்கள்.',
            'difficulty': 'Beginner',
            'category': 'Social Studies',
            'lessons': [
                {
                    'title': 'Our Country - India',
                    'titleTamil': 'எங்கள் நாடு - இந்தியா',
                    'content': 'India is a diverse country with many states, languages, and cultures. Learn about Indian geography, states and capitals, national symbols, and important historical events.',
                    'contentTamil': 'இந்தியா பல மாநிலங்கள், மொழிகள் மற்றும் கலாச்சாரங்களைக் கொண்ட பல்வகை நாடாகும். இந்திய புவியியல், மாநிலங்கள் மற்றும் தலைநகரங்கள், தேசிய சின்னங்கள் மற்றும் முக்கியமான வரலாற்று நிகழ்வுகளைப் பற்றி அறிக.',
                    'order': 1
                },
                {
                    'title': 'Maps and Directions',
                    'titleTamil': 'வரைபடங்கள் மற்றும் திசைகள்',
                    'content': 'Maps help us understand locations and directions. Learn to read maps, understand directions (north, south, east, west), and locate places on a map.',
                    'contentTamil': 'வரைபடங்கள் இடங்கள் மற்றும் திசைகளைப் புரிந்து கொள்ள உதவுகின்றன. வரைபடங்களைப் படிக்க, திசைகளைப் புரிந்து கொள்ள (வடக்கு, தெற்கு, கிழக்கு, மேற்கு) மற்றும் வரைபடத்தில் இடங்களைக் கண்டறிய கற்றுக்கொள்ளுங்கள்.',
                    'order': 2
                },
                {
                    'title': 'Our Community',
                    'titleTamil': 'எங்கள் சமூகம்',
                    'content': 'A community is a group of people living together. Learn about different types of communities, community helpers (doctors, teachers, police), and how communities work together.',
                    'contentTamil': 'சமூகம் என்பது ஒன்றாக வாழும் மக்களின் குழுவாகும். வெவ்வேறு வகையான சமூகங்கள், சமூக உதவியாளர்கள் (மருத்துவர்கள், ஆசிரியர்கள், காவல்துறை) மற்றும் சமூகங்கள் எவ்வாறு ஒன்றாக வேலை செய்கின்றன என்பதைப் பற்றி அறிக.',
                    'order': 3
                },
                {
                    'title': 'Festivals and Celebrations',
                    'titleTamil': 'திருவிழாக்கள் மற்றும் கொண்டாட்டங்கள்',
                    'content': 'India celebrates many festivals throughout the year. Learn about major festivals like Diwali, Pongal, Eid, Christmas, and their significance. Understand how festivals bring people together.',
                    'contentTamil': 'இந்தியா ஆண்டு முழுவதும் பல திருவிழாக்களைக் கொண்டாடுகிறது. தீபாவளி, பொங்கல், ஈத், கிறிஸ்துமஸ் போன்ற முக்கிய திருவிழாக்கள் மற்றும் அவற்றின் முக்கியத்துவம் பற்றி அறிக. திருவிழாக்கள் மக்களை எவ்வாறு ஒன்றிணைக்கின்றன என்பதைப் புரிந்து கொள்ளுங்கள்.',
                    'order': 4
                }
            ]
        },
        {
            'title': 'Computer Science',
            'titleTamil': 'கணினி அறிவியல்',
            'description': 'Introduction to computers, basic programming concepts, and digital literacy. Learn how computers work and how to use them effectively.',
            'descriptionTamil': 'கணினிகள், அடிப்படை நிரலாக்க கருத்துக்கள் மற்றும் டிஜிட்டல் எழுத்தறிவு அறிமுகம். கணினிகள் எவ்வாறு செயல்படுகின்றன மற்றும் அவற்றை திறம்பட எவ்வாறு பயன்படுத்துவது என்பதைக் கற்றுக்கொள்ளுங்கள்.',
            'difficulty': 'Beginner',
            'category': 'Computer Science',
            'lessons': [
                {
                    'title': 'Introduction to Computers',
                    'titleTamil': 'கணினிகளின் அறிமுகம்',
                    'content': 'A computer is an electronic device that processes information. Learn about computer parts: monitor, keyboard, mouse, CPU, and how they work together. Understand basic computer operations.',
                    'contentTamil': 'கணினி என்பது தகவல்களைச் செயலாக்கும் மின்னணு சாதனமாகும். கணினி பாகங்களைப் பற்றி அறிக: மானிட்டர், விசைப்பலகை, சுட்டி, CPU, மற்றும் அவை எவ்வாறு ஒன்றாக வேலை செய்கின்றன. அடிப்படை கணினி செயல்பாடுகளைப் புரிந்து கொள்ளுங்கள்.',
                    'order': 1
                },
                {
                    'title': 'Using a Keyboard and Mouse',
                    'titleTamil': 'விசைப்பலகை மற்றும் சுட்டியைப் பயன்படுத்துதல்',
                    'content': 'The keyboard and mouse are input devices. Learn to type letters, numbers, and special characters. Practice using the mouse to click, drag, and select items on the screen.',
                    'contentTamil': 'விசைப்பலகை மற்றும் சுட்டி உள்ளீட்டு சாதனங்கள். எழுத்துக்கள், எண்கள் மற்றும் சிறப்பு எழுத்துக்களை தட்டச்சு செய்ய கற்றுக்கொள்ளுங்கள். திரையில் உருளி, இழுத்து மற்றும் உருப்படிகளைத் தேர்ந்தெடுக்க சுட்டியைப் பயன்படுத்த பயிற்சி செய்யுங்கள்.',
                    'order': 2
                },
                {
                    'title': 'Introduction to Internet',
                    'titleTamil': 'இணையத்தின் அறிமுகம்',
                    'content': 'The Internet is a global network connecting computers worldwide. Learn about websites, web browsers, and how to safely search for information online. Understand internet safety rules.',
                    'contentTamil': 'இணையம் என்பது உலகெங்கிலும் உள்ள கணினிகளை இணைக்கும் உலகளாவிய நெட்வொர்க் ஆகும். வலைத்தளங்கள், வலை உலாவிகள் மற்றும் ஆன்லைனில் பாதுகாப்பாக தகவல்களைத் தேடுவது பற்றி அறிக. இணைய பாதுகாப்பு விதிகளைப் புரிந்து கொள்ளுங்கள்.',
                    'order': 3
                },
                {
                    'title': 'Basic Programming Concepts',
                    'titleTamil': 'அடிப்படை நிரலாக்க கருத்துக்கள்',
                    'content': 'Programming is giving instructions to a computer. Learn basic concepts like algorithms (step-by-step instructions), sequences, and simple commands. Practice logical thinking and problem-solving.',
                    'contentTamil': 'நிரலாக்கம் என்பது கணினிக்கு வழிமுறைகளை வழங்குவதாகும். வழிமுறைகள் (படிப்படியான வழிமுறைகள்), வரிசைகள் மற்றும் எளிய கட்டளைகள் போன்ற அடிப்படை கருத்துக்களைக் கற்றுக்கொள்ளுங்கள். தர்க்கரீதியான சிந்தனை மற்றும் சிக்கல் தீர்வை பயிற்சி செய்யுங்கள்.',
                    'order': 4
                }
            ]
        },
        {
            'title': 'Environmental Science',
            'titleTamil': 'சுற்றுச்சூழல் அறிவியல்',
            'description': 'Learn about the environment, nature, conservation, and how to protect our planet. Understand the importance of clean air, water, and sustainable living.',
            'descriptionTamil': 'சுற்றுச்சூழல், இயற்கை, பாதுகாப்பு மற்றும் நமது கிரகத்தை எவ்வாறு பாதுகாக்குவது என்பதைப் பற்றி அறிக. சுத்தமான காற்று, நீர் மற்றும் நிலையான வாழ்க்கையின் முக்கியத்துவத்தைப் புரிந்து கொள்ளுங்கள்.',
            'difficulty': 'Beginner',
            'category': 'Science',
            'lessons': [
                {
                    'title': 'Our Environment',
                    'titleTamil': 'எங்கள் சுற்றுச்சூழல்',
                    'content': 'The environment includes everything around us: air, water, land, plants, and animals. Learn about natural resources and why they are important for life on Earth.',
                    'contentTamil': 'சுற்றுச்சூழல் நம்மைச் சுற்றியுள்ள அனைத்தையும் உள்ளடக்கியது: காற்று, நீர், நிலம், தாவரங்கள் மற்றும் விலங்குகள். இயற்கை வளங்கள் மற்றும் அவை பூமியில் உள்ள வாழ்க்கைக்கு ஏன் முக்கியமானவை என்பதைப் பற்றி அறிக.',
                    'order': 1
                },
                {
                    'title': 'Pollution and Its Effects',
                    'titleTamil': 'மாசுபாடு மற்றும் அதன் விளைவுகள்',
                    'content': 'Pollution happens when harmful substances enter our environment. Learn about air pollution, water pollution, and land pollution. Understand how pollution affects plants, animals, and humans.',
                    'contentTamil': 'தீங்கு விளைவிக்கும் பொருட்கள் நமது சுற்றுச்சூழலில் நுழையும்போது மாசுபாடு ஏற்படுகிறது. காற்று மாசுபாடு, நீர் மாசுபாடு மற்றும் நில மாசுபாடு பற்றி அறிக. மாசுபாடு தாவரங்கள், விலங்குகள் மற்றும் மனிதர்களை எவ்வாறு பாதிக்கிறது என்பதைப் புரிந்து கொள்ளுங்கள்.',
                    'order': 2
                },
                {
                    'title': 'Conservation and Recycling',
                    'titleTamil': 'பாதுகாப்பு மற்றும் மறுசுழற்சி',
                    'content': 'Conservation means protecting and preserving our natural resources. Learn about the 3 Rs: Reduce, Reuse, and Recycle. Understand how recycling helps protect the environment.',
                    'contentTamil': 'பாதுகாப்பு என்பது நமது இயற்கை வளங்களைப் பாதுகாத்தல் மற்றும் பாதுகாத்தல் என்பதாகும். 3 R களைப் பற்றி அறிக: குறைத்தல், மீண்டும் பயன்படுத்துதல் மற்றும் மறுசுழற்சி. மறுசுழற்சி சுற்றுச்சூழலைப் பாதுகாக்க எவ்வாறு உதவுகிறது என்பதைப் புரிந்து கொள்ளுங்கள்.',
                    'order': 3
                },
                {
                    'title': 'Protecting Wildlife',
                    'titleTamil': 'வனவிலங்குகளைப் பாதுகாத்தல்',
                    'content': 'Wildlife includes all animals and plants that live in nature. Learn about endangered species and why it is important to protect them. Understand how we can help preserve biodiversity.',
                    'contentTamil': 'வனவிலங்கு என்பது இயற்கையில் வாழும் அனைத்து விலங்குகள் மற்றும் தாவரங்களை உள்ளடக்கியது. அழிந்து வரும் இனங்கள் மற்றும் அவற்றைப் பாதுகாக்க ஏன் முக்கியமானது என்பதைப் பற்றி அறிக. உயிரியல் பன்மைத்தன்மையைப் பாதுகாக்க நாம் எவ்வாறு உதவ முடியும் என்பதைப் புரிந்து கொள்ளுங்கள்.',
                    'order': 4
                }
            ]
        },
        {
            'title': 'Art and Drawing',
            'titleTamil': 'கலை மற்றும் வரைதல்',
            'description': 'Express yourself through art! Learn drawing, coloring, painting, and creative skills. Explore different art forms and techniques.',
            'descriptionTamil': 'கலையின் மூலம் உங்களை வெளிப்படுத்துங்கள்! வரைதல், வண்ணம் தீட்டுதல், ஓவியம் மற்றும் படைப்பு திறன்களைக் கற்றுக்கொள்ளுங்கள். வெவ்வேறு கலை வடிவங்கள் மற்றும் நுட்பங்களை ஆராயுங்கள்.',
            'difficulty': 'Beginner',
            'category': 'Arts',
            'lessons': [
                {
                    'title': 'Basic Shapes and Lines',
                    'titleTamil': 'அடிப்படை வடிவங்கள் மற்றும் கோடுகள்',
                    'content': 'All drawings start with basic shapes and lines. Learn to draw circles, squares, triangles, and rectangles. Practice drawing straight lines, curved lines, and different patterns.',
                    'contentTamil': 'அனைத்து வரைபடங்களும் அடிப்படை வடிவங்கள் மற்றும் கோடுகளுடன் தொடங்குகின்றன. வட்டங்கள், சதுரங்கள், முக்கோணங்கள் மற்றும் செவ்வகங்களை வரைய கற்றுக்கொள்ளுங்கள். நேர் கோடுகள், வளைந்த கோடுகள் மற்றும் வெவ்வேறு வடிவங்களை வரைய பயிற்சி செய்யுங்கள்.',
                    'order': 1
                },
                {
                    'title': 'Coloring Techniques',
                    'titleTamil': 'வண்ணம் தீட்டும் நுட்பங்கள்',
                    'content': 'Colors make drawings beautiful and expressive. Learn about primary colors (red, blue, yellow) and how to mix them to create new colors. Practice coloring within lines and using different coloring tools.',
                    'contentTamil': 'வண்ணங்கள் வரைபடங்களை அழகாகவும் வெளிப்படையாகவும் ஆக்குகின்றன. முதன்மை வண்ணங்கள் (சிவப்பு, நீலம், மஞ்சள்) மற்றும் புதிய வண்ணங்களை உருவாக்க அவற்றை எவ்வாறு கலக்குவது என்பதைப் பற்றி அறிக. கோடுகளுக்குள் வண்ணம் தீட்டுதல் மற்றும் வெவ்வேறு வண்ணம் தீட்டும் கருவிகளைப் பயன்படுத்துதல் பயிற்சி செய்யுங்கள்.',
                    'order': 2
                },
                {
                    'title': 'Drawing Nature',
                    'titleTamil': 'இயற்கையை வரைதல்',
                    'content': 'Nature provides endless inspiration for art. Learn to draw trees, flowers, animals, and landscapes. Practice observing nature and capturing its beauty in your drawings.',
                    'contentTamil': 'இயற்கை கலையுக்கு முடிவில்லாத ஊக்கத்தை வழங்குகிறது. மரங்கள், பூக்கள், விலங்குகள் மற்றும் நிலப்பரப்புகளை வரைய கற்றுக்கொள்ளுங்கள். இயற்கையைக் கவனித்து அதன் அழகை உங்கள் வரைபடங்களில் பிடிக்க பயிற்சி செய்யுங்கள்.',
                    'order': 3
                },
                {
                    'title': 'Creative Expression',
                    'titleTamil': 'படைப்பு வெளிப்பாடு',
                    'content': 'Art is a way to express your feelings and ideas. Create your own drawings, paintings, and artwork. Learn that there is no right or wrong in art - be creative and have fun!',
                    'contentTamil': 'கலை என்பது உங்கள் உணர்வுகள் மற்றும் யோசனைகளை வெளிப்படுத்துவதற்கான ஒரு வழியாகும். உங்கள் சொந்த வரைபடங்கள், ஓவியங்கள் மற்றும் கலைப் படைப்புகளை உருவாக்குங்கள். கலையில் சரி அல்லது தவறு இல்லை என்பதை அறிக - படைப்பாற்றலுடன் இருந்து மகிழுங்கள்!',
                    'order': 4
                }
            ]
        }
    ]
    
    print(f"\nSeeding {len(courses_data)} courses with lessons...")
    
    for course_data in courses_data:
        # Extract lessons before creating course
        lessons = course_data.pop('lessons', [])
        
        # Create the course
        print(f"\nCreating course: {course_data['title']} ({course_data['titleTamil']})")
        course = CourseModel.create(course_data)
        course_id = course['id']
        
        print(f"  Course ID: {course_id}")
        print(f"  Adding {len(lessons)} lessons...")
        
        # Create lessons for this course
        for lesson_data in lessons:
            lesson_data['courseId'] = course_id
            lesson = LessonModel.create(lesson_data)
            print(f"    - {lesson['title']}")
    
    print(f"\nSuccessfully seeded {len(courses_data)} courses with lessons!")
    print(f"Total courses in database: {db['courses'].count_documents({})}")
    print(f"Total lessons in database: {db['lessons'].count_documents({})}")

if __name__ == '__main__':
    try:
        seed_courses()
    except Exception as e:
        print(f"\nError seeding courses: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

