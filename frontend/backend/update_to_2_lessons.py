"""
Update Mathematics and Science courses to have only 2 lessons each
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

def update_to_2_lessons():
    """Update Mathematics and Science to have only 2 lessons each"""
    
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
    
    # Delete all existing lessons for these courses
    db['lessons'].delete_many({'courseId': math_course_id})
    db['lessons'].delete_many({'courseId': science_course_id})
    
    print(f"\nUpdating Mathematics course (ID: {math_course_id})...")
    
    # Mathematics - 2 lessons only
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
        }
    ]
    
    print(f"\nUpdating Science course (ID: {science_course_id})...")
    
    # Science - 2 lessons only
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
    
    print(f"\nSuccessfully updated courses to 2 lessons each!")
    print(f"Mathematics lessons: {db['lessons'].count_documents({'courseId': math_course_id})}")
    print(f"Science lessons: {db['lessons'].count_documents({'courseId': science_course_id})}")

if __name__ == '__main__':
    try:
        update_to_2_lessons()
    except Exception as e:
        print(f"\nError updating courses: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

