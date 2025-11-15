"""
Script to update Science and Mathematics courses with detailed content
"""
import sys
import os
from datetime import datetime

# Fix Unicode encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models import CourseModel, LessonModel, db
from bson import ObjectId

def update_math_science_courses():
    """Update Mathematics and Science courses with detailed content"""
    
    # Find Mathematics and Science courses
    math_course = db['courses'].find_one({'title': 'Mathematics'})
    science_course = db['courses'].find_one({'title': 'Science'})
    
    if not math_course:
        print("Mathematics course not found!")
        return
    
    if not science_course:
        print("Science course not found!")
        return
    
    math_course_id = str(math_course['_id'])
    science_course_id = str(science_course['_id'])
    
    # Delete existing lessons for these courses
    db['lessons'].delete_many({'courseId': math_course_id})
    db['lessons'].delete_many({'courseId': science_course_id})
    
    print(f"\nUpdating Mathematics course (ID: {math_course_id})...")
    
    # Mathematics lessons with detailed content
    math_lessons = [
        {
            'courseId': math_course_id,
            'title': 'Introduction to Numbers',
            'titleTamil': 'எண்களின் அறிமுகம்',
            'content': '''Numbers are the foundation of mathematics. We use numbers every day to count, measure, and solve problems. 

In this lesson, you will learn:
- What are numbers and why they are important
- Counting from 1 to 100
- Recognizing number patterns
- Understanding place value (ones, tens, hundreds)
- Comparing numbers (greater than, less than, equal to)

Numbers help us understand quantity. For example, if you have 5 apples, the number 5 tells us exactly how many apples you have. We use numbers to count objects, measure distances, tell time, and much more.

Practice counting objects around you. Count your fingers, count books on a shelf, count steps as you walk. The more you practice, the better you become at working with numbers!''',
            'contentTamil': '''எண்கள் கணிதத்தின் அடித்தளம். எண்ண, அளவிட மற்றும் சிக்கல்களைத் தீர்க்க நாம் ஒவ்வொரு நாளும் எண்களைப் பயன்படுத்துகிறோம்.

இந்த பாடத்தில் நீங்கள் கற்றுக்கொள்வீர்கள்:
- எண்கள் என்றால் என்ன மற்றும் அவை ஏன் முக்கியமானவை
- 1 முதல் 100 வரை எண்ணுதல்
- எண் வடிவங்களை அடையாளம் காணுதல்
- இட மதிப்பைப் புரிந்து கொள்ளுதல் (ஒன்றுகள், பத்துகள், நூறுகள்)
- எண்களை ஒப்பிடுதல் (அதிகமான, குறைவான, சமமான)

எண்கள் அளவைப் புரிந்து கொள்ள உதவுகின்றன. எடுத்துக்காட்டாக, உங்களிடம் 5 ஆப்பிள்கள் இருந்தால், எண் 5 உங்களிடம் எத்தனை ஆப்பிள்கள் உள்ளன என்பதை சரியாகச் சொல்லுகிறது. பொருள்களை எண்ண, தூரங்களை அளவிட, நேரத்தைச் சொல்ல மற்றும் பலவற்றிற்கு எண்களைப் பயன்படுத்துகிறோம்.

உங்களைச் சுற்றியுள்ள பொருள்களை எண்ண பயிற்சி செய்யுங்கள். உங்கள் விரல்களை எண்ணுங்கள், அலமாரியில் உள்ள புத்தகங்களை எண்ணுங்கள், நீங்கள் நடக்கும்போது படிகளை எண்ணுங்கள். நீங்கள் அதிகம் பயிற்சி செய்யும்போது, எண்களுடன் வேலை செய்வதில் நீங்கள் சிறப்பாக மாறுவீர்கள்!''',
            'order': 1
        },
        {
            'courseId': math_course_id,
            'title': 'Addition and Subtraction',
            'titleTamil': 'கூட்டல் மற்றும் கழித்தல்',
            'content': '''Addition and subtraction are the most basic math operations. They help us combine and separate quantities.

ADDITION (+):
Addition means putting numbers together to get a total or sum. The plus sign (+) tells us to add.
- Example: 3 + 2 = 5 (three plus two equals five)
- If you have 3 apples and get 2 more, you now have 5 apples total

SUBTRACTION (-):
Subtraction means taking away from a number. The minus sign (-) tells us to subtract.
- Example: 5 - 2 = 3 (five minus two equals three)
- If you have 5 apples and eat 2, you have 3 apples left

PRACTICE PROBLEMS:
1. 4 + 3 = ?
2. 7 - 2 = ?
3. 10 + 5 = ?
4. 8 - 3 = ?

Remember: Addition makes numbers bigger, subtraction makes numbers smaller. Practice with real objects like toys or fruits to understand better!''',
            'contentTamil': '''கூட்டல் மற்றும் கழித்தல் மிகவும் அடிப்படை கணித செயல்பாடுகள். அவை அளவுகளை இணைக்கவும் பிரிக்கவும் உதவுகின்றன.

கூட்டல் (+):
கூட்டல் என்பது மொத்தம் அல்லது தொகையைப் பெற எண்களை ஒன்றாக இணைப்பதாகும். கூட்டல் குறி (+) கூட்ட வேண்டும் என்பதைக் குறிக்கிறது.
- எடுத்துக்காட்டு: 3 + 2 = 5 (மூன்று கூட்டல் இரண்டு சமம் ஐந்து)
- உங்களிடம் 3 ஆப்பிள்கள் இருந்து 2 மேலும் கிடைத்தால், இப்போது மொத்தம் 5 ஆப்பிள்கள் உள்ளன

கழித்தல் (-):
கழித்தல் என்பது ஒரு எண்ணிலிருந்து எடுப்பதாகும். கழித்தல் குறி (-) கழிக்க வேண்டும் என்பதைக் குறிக்கிறது.
- எடுத்துக்காட்டு: 5 - 2 = 3 (ஐந்து கழித்தல் இரண்டு சமம் மூன்று)
- உங்களிடம் 5 ஆப்பிள்கள் இருந்து 2 சாப்பிட்டால், 3 ஆப்பிள்கள் மீதம் உள்ளன

பயிற்சி பிரச்சனைகள்:
1. 4 + 3 = ?
2. 7 - 2 = ?
3. 10 + 5 = ?
4. 8 - 3 = ?

நினைவில் கொள்ளுங்கள்: கூட்டல் எண்களை பெரியதாக்குகிறது, கழித்தல் எண்களை சிறியதாக்குகிறது. சிறந்த புரிதலுக்கு பொம்மைகள் அல்லது பழங்கள் போன்ற உண்மையான பொருள்களுடன் பயிற்சி செய்யுங்கள்!''',
            'order': 2
        },
        {
            'courseId': math_course_id,
            'title': 'Multiplication Basics',
            'titleTamil': 'பெருக்கலின் அடிப்படைகள்',
            'content': '''Multiplication is a quick way to add the same number many times. It makes counting faster and easier!

UNDERSTANDING MULTIPLICATION:
- The × sign means "multiply" or "times"
- Example: 3 × 4 means "three times four" or "three groups of four"
- 3 × 4 = 3 + 3 + 3 + 3 = 12

MULTIPLICATION TABLES:
Learning multiplication tables helps you solve problems quickly:
- 1 × 1 = 1, 1 × 2 = 2, 1 × 3 = 3...
- 2 × 1 = 2, 2 × 2 = 4, 2 × 3 = 6...
- 3 × 1 = 3, 3 × 2 = 6, 3 × 3 = 9...

REAL-WORLD EXAMPLES:
- If you have 4 boxes with 5 toys each: 4 × 5 = 20 toys total
- If you eat 3 cookies every day for 5 days: 3 × 5 = 15 cookies total

PRACTICE:
1. 2 × 3 = ?
2. 4 × 5 = ?
3. 6 × 2 = ?
4. 3 × 7 = ?

Remember: Any number multiplied by 1 equals itself. Any number multiplied by 0 equals 0!''',
            'contentTamil': '''பெருக்கல் என்பது ஒரே எண்ணை பல முறை சேர்ப்பதற்கான விரைவான வழியாகும். இது எண்ணுவதை வேகமாகவும் எளிதாகவும் ஆக்குகிறது!

பெருக்கலைப் புரிந்து கொள்ளுதல்:
- × குறி "பெருக்க" அல்லது "முறை" என்று பொருள்
- எடுத்துக்காட்டு: 3 × 4 என்பது "மூன்று முறை நான்கு" அல்லது "நான்கின் மூன்று குழுக்கள்"
- 3 × 4 = 3 + 3 + 3 + 3 = 12

பெருக்கல் அட்டவணைகள்:
பெருக்கல் அட்டவணைகளைக் கற்றுக்கொள்வது சிக்கல்களை விரைவாகத் தீர்க்க உதவுகிறது:
- 1 × 1 = 1, 1 × 2 = 2, 1 × 3 = 3...
- 2 × 1 = 2, 2 × 2 = 4, 2 × 3 = 6...
- 3 × 1 = 3, 3 × 2 = 6, 3 × 3 = 9...

உண்மையான உலக எடுத்துக்காட்டுகள்:
- ஒவ்வொன்றிலும் 5 பொம்மைகள் கொண்ட 4 பெட்டிகள் இருந்தால்: 4 × 5 = 20 பொம்மைகள் மொத்தம்
- 5 நாட்களுக்கு ஒவ்வொரு நாளும் 3 குக்கீகளை சாப்பிட்டால்: 3 × 5 = 15 குக்கீகள் மொத்தம்

பயிற்சி:
1. 2 × 3 = ?
2. 4 × 5 = ?
3. 6 × 2 = ?
4. 3 × 7 = ?

நினைவில் கொள்ளுங்கள்: எந்த எண்ணையும் 1 ஆல் பெருக்கினால் அது தானே வரும். எந்த எண்ணையும் 0 ஆல் பெருக்கினால் 0 வரும்!''',
            'order': 3
        },
        {
            'courseId': math_course_id,
            'title': 'Introduction to Geometry',
            'titleTamil': 'வடிவியலின் அறிமுகம்',
            'content': '''Geometry is the study of shapes, sizes, and space. Everything around us has a shape!

BASIC SHAPES:
- CIRCLE: A round shape with no corners (like a coin, wheel, or pizza)
- SQUARE: A shape with 4 equal sides and 4 corners (like a window or tile)
- TRIANGLE: A shape with 3 sides and 3 corners (like a slice of pizza or a roof)
- RECTANGLE: A shape with 4 sides where opposite sides are equal (like a door or book)

SIZES AND MEASUREMENTS:
- AREA: The space inside a shape (measured in square units)
- PERIMETER: The distance around a shape (add all sides)
- Example: A square with sides of 4 cm has:
  - Perimeter = 4 + 4 + 4 + 4 = 16 cm
  - Area = 4 × 4 = 16 square cm

SHAPES IN REAL LIFE:
- Look around you! Find circles (clocks, plates), squares (windows, tiles), triangles (roofs, signs), and rectangles (doors, books)

PRACTICE:
1. How many sides does a triangle have?
2. What shape is a coin?
3. If a rectangle has length 5 cm and width 3 cm, what is its perimeter?

Shapes are everywhere! Learning geometry helps us understand the world around us better.''',
            'contentTamil': '''வடிவியல் என்பது வடிவங்கள், அளவுகள் மற்றும் இடத்தின் ஆய்வு. நம்மைச் சுற்றியுள்ள அனைத்தும் ஒரு வடிவத்தைக் கொண்டுள்ளன!

அடிப்படை வடிவங்கள்:
- வட்டம்: மூலைகள் இல்லாத வட்ட வடிவம் (நாணயம், சக்கரம் அல்லது பீட்சா போன்றது)
- சதுரம்: 4 சம பக்கங்கள் மற்றும் 4 மூலைகள் கொண்ட வடிவம் (சன்னல் அல்லது ஓடு போன்றது)
- முக்கோணம்: 3 பக்கங்கள் மற்றும் 3 மூலைகள் கொண்ட வடிவம் (பீட்சா துண்டு அல்லது கூரை போன்றது)
- செவ்வகம்: எதிரெதிர் பக்கங்கள் சமமாக இருக்கும் 4 பக்கங்கள் கொண்ட வடிவம் (கதவு அல்லது புத்தகம் போன்றது)

அளவுகள் மற்றும் அளவீடுகள்:
- பரப்பளவு: ஒரு வடிவத்திற்குள் உள்ள இடம் (சதுர அலகுகளில் அளவிடப்படுகிறது)
- சுற்றளவு: ஒரு வடிவத்தைச் சுற்றியுள்ள தூரம் (அனைத்து பக்கங்களையும் சேர்க்கவும்)
- எடுத்துக்காட்டு: 4 செ.மீ பக்கங்கள் கொண்ட சதுரம்:
  - சுற்றளவு = 4 + 4 + 4 + 4 = 16 செ.மீ
  - பரப்பளவு = 4 × 4 = 16 சதுர செ.மீ

உண்மையான வாழ்க்கையில் வடிவங்கள்:
- உங்களைச் சுற்றி பாருங்கள்! வட்டங்கள் (கடிகாரங்கள், தட்டுகள்), சதுரங்கள் (சன்னல்கள், ஓடுகள்), முக்கோணங்கள் (கூரைகள், அறிகுறிகள்) மற்றும் செவ்வகங்கள் (கதவுகள், புத்தகங்கள்) ஆகியவற்றைக் கண்டறியுங்கள்

பயிற்சி:
1. முக்கோணத்திற்கு எத்தனை பக்கங்கள் உள்ளன?
2. நாணயம் என்ன வடிவம்?
3. ஒரு செவ்வகத்தின் நீளம் 5 செ.மீ மற்றும் அகலம் 3 செ.மீ எனில், அதன் சுற்றளவு என்ன?

வடிவங்கள் எல்லா இடங்களிலும் உள்ளன! வடிவியலைக் கற்றுக்கொள்வது நம்மைச் சுற்றியுள்ள உலகத்தை நன்றாகப் புரிந்து கொள்ள உதவுகிறது.''',
            'order': 4
        }
    ]
    
    print(f"\nUpdating Science course (ID: {science_course_id})...")
    
    # Science lessons with detailed content
    science_lessons = [
        {
            'courseId': science_course_id,
            'title': 'Living and Non-Living Things',
            'titleTamil': 'உயிரினங்கள் மற்றும் உயிரற்ற பொருட்கள்',
            'content': '''Everything in the world can be divided into two groups: living things and non-living things.

LIVING THINGS have these characteristics:
1. GROW: They get bigger over time (a baby grows into an adult)
2. REPRODUCE: They make more of their own kind (plants make seeds, animals have babies)
3. NEED FOOD: They eat to get energy (plants make food from sunlight, animals eat plants or other animals)
4. RESPOND: They react to their environment (plants grow toward light, animals run from danger)
5. BREATHE: They need air to live (plants and animals both breathe)

Examples of LIVING THINGS:
- Plants: trees, flowers, grass
- Animals: humans, dogs, birds, fish
- Tiny living things: bacteria, fungi

NON-LIVING THINGS do not have these characteristics:
- They don't grow, reproduce, eat, or breathe
- Examples: rocks, water, air, books, toys, cars

ACTIVITY:
Look around your room. Make two lists:
1. List all living things you see
2. List all non-living things you see

Understanding the difference helps us learn about life and how living things survive!''',
            'contentTamil': '''உலகில் உள்ள அனைத்தும் இரண்டு குழுக்களாகப் பிரிக்கப்படலாம்: உயிரினங்கள் மற்றும் உயிரற்ற பொருட்கள்.

உயிரினங்களுக்கு இந்த பண்புகள் உள்ளன:
1. வளர்ச்சி: காலப்போக்கில் அவை பெரியதாகின்றன (ஒரு குழந்தை வயது வந்தவராக வளர்கிறது)
2. இனப்பெருக்கம்: அவை தங்கள் சொந்த வகையை மேலும் உருவாக்குகின்றன (தாவரங்கள் விதைகளை உருவாக்குகின்றன, விலங்குகள் குழந்தைகளைப் பெறுகின்றன)
3. உணவு தேவை: ஆற்றலைப் பெற அவை சாப்பிடுகின்றன (தாவரங்கள் சூரிய ஒளியிலிருந்து உணவை உருவாக்குகின்றன, விலங்குகள் தாவரங்கள் அல்லது பிற விலங்குகளை சாப்பிடுகின்றன)
4. பதிலளித்தல்: அவை தங்கள் சூழலுக்கு எதிர்வினை செய்கின்றன (தாவரங்கள் ஒளியை நோக்கி வளரும், விலங்குகள் ஆபத்திலிருந்து ஓடும்)
5. சுவாசித்தல்: வாழ ஆக்ஸிஜன் தேவை (தாவரங்கள் மற்றும் விலங்குகள் இரண்டும் சுவாசிக்கின்றன)

உயிரினங்களின் எடுத்துக்காட்டுகள்:
- தாவரங்கள்: மரங்கள், பூக்கள், புல்
- விலங்குகள்: மனிதர்கள், நாய்கள், பறவைகள், மீன்கள்
- சிறிய உயிரினங்கள்: பாக்டீரியா, பூஞ்சை

உயிரற்ற பொருட்களுக்கு இந்த பண்புகள் இல்லை:
- அவை வளராது, இனப்பெருக்கம் செய்யாது, சாப்பிடாது அல்லது சுவாசிக்காது
- எடுத்துக்காட்டுகள்: பாறைகள், நீர், காற்று, புத்தகங்கள், பொம்மைகள், கார்கள்

செயல்பாடு:
உங்கள் அறையைச் சுற்றி பாருங்கள். இரண்டு பட்டியல்களை உருவாக்குங்கள்:
1. நீங்கள் பார்க்கும் அனைத்து உயிரினங்களையும் பட்டியலிடுங்கள்
2. நீங்கள் பார்க்கும் அனைத்து உயிரற்ற பொருட்களையும் பட்டியலிடுங்கள்

வித்தியாசத்தைப் புரிந்து கொள்வது வாழ்க்கை மற்றும் உயிரினங்கள் எவ்வாறு உயிர்வாழ்கின்றன என்பதைக் கற்றுக்கொள்ள உதவுகிறது!''',
            'order': 1
        },
        {
            'courseId': science_course_id,
            'title': 'The Human Body',
            'titleTamil': 'மனித உடல்',
            'content': '''The human body is amazing! It has many parts that work together to keep us alive and healthy.

MAIN BODY PARTS:
- HEAD: Contains the brain (controls thinking) and face (eyes, nose, mouth, ears)
- TRUNK: The main body (chest and stomach)
- ARMS: Two arms with hands and fingers (for touching, holding, writing)
- LEGS: Two legs with feet and toes (for walking, running, jumping)

IMPORTANT BODY SYSTEMS:
1. SKELETAL SYSTEM: Bones give our body shape and support (we have 206 bones!)
2. MUSCULAR SYSTEM: Muscles help us move (over 600 muscles in our body)
3. DIGESTIVE SYSTEM: Breaks down food so our body can use it (stomach, intestines)
4. RESPIRATORY SYSTEM: Helps us breathe (lungs, nose, mouth)
5. CIRCULATORY SYSTEM: Pumps blood throughout the body (heart, blood vessels)

KEEPING OUR BODY HEALTHY:
- Eat healthy food (fruits, vegetables, grains)
- Drink plenty of water
- Exercise regularly (walking, playing, sports)
- Get enough sleep (8-10 hours for children)
- Wash hands to prevent germs

FUN FACTS:
- Your heart beats about 100,000 times per day!
- You have about 5 liters of blood in your body
- Your brain uses about 20% of your body's energy

Take care of your body - it's the only one you have!''',
            'contentTamil': '''மனித உடல் ஆச்சரியமானது! நம்மை உயிருடன் மற்றும் ஆரோக்கியமாக வைத்திருக்க பல பகுதிகள் ஒன்றாக வேலை செய்கின்றன.

முக்கிய உடல் பகுதிகள்:
- தலை: மூளை (சிந்தனையைக் கட்டுப்படுத்துகிறது) மற்றும் முகம் (கண்கள், மூக்கு, வாய், காதுகள்) உள்ளன
- உடற்பகுதி: முக்கிய உடல் (மார்பு மற்றும் வயிறு)
- கைகள்: கைகள் மற்றும் விரல்கள் கொண்ட இரண்டு கைகள் (தொட, பிடிக்க, எழுத)
- கால்கள்: கால்கள் மற்றும் கால் விரல்கள் கொண்ட இரண்டு கால்கள் (நடக்க, ஓட, குதிக்க)

முக்கியமான உடல் அமைப்புகள்:
1. எலும்பு மண்டலம்: எலும்புகள் நமது உடலுக்கு வடிவம் மற்றும் ஆதரவை அளிக்கின்றன (நமக்கு 206 எலும்புகள் உள்ளன!)
2. தசை அமைப்பு: தசைகள் நகர உதவுகின்றன (நமது உடலில் 600 க்கும் மேற்பட்ட தசைகள்)
3. செரிமான அமைப்பு: உணவை உடைத்து நமது உடல் அதைப் பயன்படுத்த (வயிறு, குடல்)
4. சுவாச அமைப்பு: சுவாசிக்க உதவுகிறது (நுரையீரல், மூக்கு, வாய்)
5. இரத்த சுழற்சி அமைப்பு: உடல் முழுவதும் இரத்தத்தை பம்ப் செய்கிறது (இதயம், இரத்த நாளங்கள்)

நமது உடலை ஆரோக்கியமாக வைத்திருத்தல்:
- ஆரோக்கியமான உணவை சாப்பிடுங்கள் (பழங்கள், காய்கறிகள், தானியங்கள்)
- நிறைய தண்ணீர் குடியுங்கள்
- தவறாமல் உடற்பயிற்சி செய்யுங்கள் (நடத்தல், விளையாடுதல், விளையாட்டுகள்)
- போதுமான தூக்கம் (குழந்தைகளுக்கு 8-10 மணி நேரம்)
- கிருமிகளைத் தடுக்க கைகளைக் கழுவுங்கள்

சுவாரஸ்யமான உண்மைகள்:
- உங்கள் இதயம் ஒரு நாளைக்கு சுமார் 100,000 முறை துடிக்கிறது!
- உங்கள் உடலில் சுமார் 5 லிட்டர் இரத்தம் உள்ளது
- உங்கள் மூளை உங்கள் உடலின் ஆற்றலில் சுமார் 20% பயன்படுத்துகிறது

உங்கள் உடலை கவனித்துக் கொள்ளுங்கள் - இது உங்களிடம் உள்ள ஒரே உடல்!''',
            'order': 2
        },
        {
            'courseId': science_course_id,
            'title': 'Plants and Their Parts',
            'titleTamil': 'தாவரங்கள் மற்றும் அவற்றின் பகுதிகள்',
            'content': '''Plants are living things that make their own food! They are very important for life on Earth.

PARTS OF A PLANT:
1. ROOTS: Grow underground, absorb water and nutrients from soil, hold the plant in place
2. STEM: The main body that supports the plant, carries water and food between roots and leaves
3. LEAVES: Make food for the plant using sunlight (this process is called photosynthesis)
4. FLOWERS: Beautiful parts that help plants reproduce (make seeds)
5. FRUITS: Contain seeds for new plants to grow

HOW PLANTS GROW:
- Plants need WATER (from roots)
- Plants need SUNLIGHT (for making food)
- Plants need AIR (they breathe like us!)
- Plants need SOIL (for nutrients and support)

TYPES OF PLANTS:
- TREES: Big plants with strong trunks (mango tree, coconut tree)
- SHRUBS: Medium-sized plants (rose bush, hibiscus)
- HERBS: Small plants used for cooking (coriander, mint)
- GRASSES: Small plants that cover the ground

IMPORTANCE OF PLANTS:
- They give us OXYGEN to breathe
- They give us FOOD (fruits, vegetables, grains)
- They provide SHADE and beauty
- They help prevent SOIL EROSION
- They are homes for many animals

ACTIVITY:
Plant a seed and watch it grow! You'll see roots, stem, and leaves develop. Take care of it with water and sunlight!''',
            'contentTamil': '''தாவரங்கள் தங்கள் சொந்த உணவை உருவாக்கும் உயிரினங்கள்! பூமியில் உள்ள வாழ்க்கைக்கு அவை மிகவும் முக்கியமானவை.

தாவரத்தின் பகுதிகள்:
1. வேர்கள்: நிலத்தடியில் வளரும், மண்ணிலிருந்து நீர் மற்றும் ஊட்டச்சத்துக்களை உறிஞ்சும், தாவரத்தை நிலைநிறுத்தும்
2. தண்டு: தாவரத்தை ஆதரிக்கும் முக்கிய உடல், வேர்கள் மற்றும் இலைகளுக்கு இடையில் நீர் மற்றும் உணவை எடுத்துச் செல்கிறது
3. இலைகள்: சூரிய ஒளியைப் பயன்படுத்தி தாவரத்திற்கு உணவை உருவாக்குகின்றன (இந்த செயல்முறை ஒளிச்சேர்க்கை என்று அழைக்கப்படுகிறது)
4. பூக்கள்: தாவரங்கள் இனப்பெருக்கம் செய்ய உதவும் அழகான பகுதிகள் (விதைகளை உருவாக்குகின்றன)
5. பழங்கள்: புதிய தாவரங்கள் வளர விதைகளைக் கொண்டுள்ளன

தாவரங்கள் எவ்வாறு வளருகின்றன:
- தாவரங்களுக்கு நீர் தேவை (வேர்களிலிருந்து)
- தாவரங்களுக்கு சூரிய ஒளி தேவை (உணவை உருவாக்க)
- தாவரங்களுக்கு காற்று தேவை (அவை நம்மைப் போல சுவாசிக்கின்றன!)
- தாவரங்களுக்கு மண் தேவை (ஊட்டச்சத்துக்கள் மற்றும் ஆதரவுக்காக)

தாவரங்களின் வகைகள்:
- மரங்கள்: வலுவான தண்டுகள் கொண்ட பெரிய தாவரங்கள் (மாம்பழ மரம், தேங்காய் மரம்)
- புதர்கள்: நடுத்தர அளவிலான தாவரங்கள் (ரோஜா புதர், செம்பருத்தி)
- மூலிகைகள்: சமையலுக்குப் பயன்படும் சிறிய தாவரங்கள் (கொத்தமல்லி, புதினா)
- புல்கள்: நிலத்தை மூடும் சிறிய தாவரங்கள்

தாவரங்களின் முக்கியத்துவம்:
- அவை சுவாசிக்க ஆக்ஸிஜனை அளிக்கின்றன
- அவை உணவை அளிக்கின்றன (பழங்கள், காய்கறிகள், தானியங்கள்)
- அவை நிழல் மற்றும் அழகை வழங்குகின்றன
- அவை மண் அரிப்பைத் தடுக்க உதவுகின்றன
- அவை பல விலங்குகளின் வீடுகள்

செயல்பாடு:
ஒரு விதையை நடுங்கள் மற்றும் அது வளர்வதைப் பாருங்கள்! வேர்கள், தண்டு மற்றும் இலைகள் வளர்வதை நீங்கள் காண்பீர்கள். நீர் மற்றும் சூரிய ஒளியுடன் அதை கவனித்துக் கொள்ளுங்கள்!''',
            'order': 3
        },
        {
            'courseId': science_course_id,
            'title': 'Water Cycle',
            'titleTamil': 'நீர் சுழற்சி',
            'content': '''Water on Earth moves in a continuous cycle! This is called the Water Cycle, and it's essential for all life.

THE WATER CYCLE STEPS:
1. EVAPORATION: The sun heats water in oceans, rivers, and lakes. Water turns into invisible water vapor (gas) and rises into the air.
2. CONDENSATION: As water vapor rises high in the sky, it cools down and turns back into tiny water droplets, forming clouds.
3. PRECIPITATION: When clouds get too heavy with water, it falls back to Earth as rain, snow, sleet, or hail.
4. COLLECTION: Water collects in oceans, rivers, lakes, and underground. Then the cycle starts again!

WHY IS IT IMPORTANT?
- Provides fresh water for drinking, farming, and all living things
- Helps plants grow (they need water!)
- Keeps Earth's temperature balanced
- Cleans and purifies water naturally

WATER STATES:
Water can exist in three forms:
- LIQUID: Water we drink, swim in, and use daily
- SOLID: Ice and snow (frozen water)
- GAS: Water vapor in the air (invisible)

FUN FACTS:
- About 97% of Earth's water is in oceans (salty water)
- Only about 3% is fresh water (what we can drink)
- The same water has been cycling on Earth for billions of years!
- You might be drinking the same water a dinosaur drank!

CONSERVATION:
Water is precious! We should:
- Turn off taps when not using
- Take shorter showers
- Fix leaks
- Don't waste water

Remember: Every drop counts!''',
            'contentTamil': '''பூமியில் உள்ள நீர் தொடர்ச்சியான சுழற்சியில் நகர்கிறது! இது நீர் சுழற்சி என்று அழைக்கப்படுகிறது, மற்றும் அனைத்து வாழ்க்கைக்கும் இது அவசியமானது.

நீர் சுழற்சி படிகள்:
1. ஆவியாதல்: சூரியன் கடல்கள், ஆறுகள் மற்றும் ஏரிகளில் உள்ள நீரை சூடாக்குகிறது. நீர் கண்ணுக்கு தெரியாத நீராவியாக (வாயு) மாறி காற்றில் உயர்ந்து செல்கிறது.
2. ஒடுக்கம்: நீராவி வானத்தில் உயர்ந்து செல்லும்போது, அது குளிர்ந்து மீண்டும் சிறிய நீர் துளிகளாக மாறி, மேகங்களை உருவாக்குகிறது.
3. மழைப்பொழிவு: மேகங்கள் நீரால் மிகவும் கனமாகும்போது, அது மழை, பனி, கல்மழை அல்லது ஆலங்கட்டி மழையாக பூமிக்குத் திரும்புகிறது.
4. சேகரிப்பு: நீர் கடல்கள், ஆறுகள், ஏரிகள் மற்றும் நிலத்தடியில் சேகரிக்கப்படுகிறது. பின்னர் சுழற்சி மீண்டும் தொடங்குகிறது!

ஏன் இது முக்கியமானது?
- குடிப்பதற்கும், விவசாயத்திற்கும் மற்றும் அனைத்து உயிரினங்களுக்கும் நன்னீரை வழங்குகிறது
- தாவரங்கள் வளர உதவுகிறது (அவற்றிற்கு நீர் தேவை!)
- பூமியின் வெப்பநிலையை சமநிலைப்படுத்துகிறது
- நீரை இயற்கையாக சுத்தம் செய்து சுத்திகரிக்கிறது

நீர் நிலைகள்:
நீர் மூன்று வடிவங்களில் இருக்கலாம்:
- திரவம்: நாம் குடிக்கும், நீந்தும் மற்றும் தினசரி பயன்படுத்தும் நீர்
- திடம்: பனி மற்றும் பனி (உறைந்த நீர்)
- வாயு: காற்றில் உள்ள நீராவி (கண்ணுக்கு தெரியாத)

சுவாரஸ்யமான உண்மைகள்:
- பூமியின் நீரில் சுமார் 97% கடல்களில் உள்ளது (உப்பு நீர்)
- சுமார் 3% மட்டுமே நன்னீர் (நாம் குடிக்கக்கூடியது)
- அதே நீர் பில்லியன் ஆண்டுகளாக பூமியில் சுழல்கிறது!
- டைனோசர் குடித்த அதே நீரை நீங்கள் குடிக்கலாம்!

பாதுகாப்பு:
நீர் விலைமதிப்பற்றது! நாம்:
- பயன்படுத்தாதபோது குழாய்களை அணைக்க வேண்டும்
- குறுகிய குளியல் எடுக்க வேண்டும்
- கசிவுகளை சரிசெய்ய வேண்டும்
- நீரை வீணாக்கக்கூடாது

நினைவில் கொள்ளுங்கள்: ஒவ்வொரு துளியும் முக்கியமானது!''',
            'order': 4
        }
    ]
    
    # Create lessons
    print(f"\nCreating {len(math_lessons)} Mathematics lessons...")
    for lesson in math_lessons:
        created = LessonModel.create(lesson)
        print(f"  - {created['title']}")
    
    print(f"\nCreating {len(science_lessons)} Science lessons...")
    for lesson in science_lessons:
        created = LessonModel.create(lesson)
        print(f"  - {created['title']}")
    
    print(f"\nSuccessfully updated Mathematics and Science courses!")
    print(f"Mathematics lessons: {db['lessons'].count_documents({'courseId': math_course_id})}")
    print(f"Science lessons: {db['lessons'].count_documents({'courseId': science_course_id})}")

if __name__ == '__main__':
    try:
        update_math_science_courses()
    except Exception as e:
        print(f"\nError updating courses: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

