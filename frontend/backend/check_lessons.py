import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models import LessonModel, CourseModel

# Get Mathematics course
math_course = CourseModel.get_by_id('691828a508e836c68a98310e')
if math_course:
    print(f"\nMathematics Course Found:")
    print(f"ID: {math_course['id']}")
    print(f"Title: {math_course['title']}")
    
    # Get lessons for this course
    lessons = LessonModel.get_by_course('691828a508e836c68a98310e')
    print(f"\nLessons found: {len(lessons)}")
    for lesson in lessons:
        print(f"\n  Lesson ID: {lesson['id']}")
        print(f"  Course ID: {lesson['courseId']}")
        print(f"  Title: {lesson['title']}")
        print(f"  Order: {lesson.get('order', 'N/A')}")
else:
    print("Mathematics course not found!")

# Check all lessons in database
from models import db
all_lessons = list(db['lessons'].find())
print(f"\n\nTotal lessons in database: {len(all_lessons)}")
for lesson in all_lessons:
    print(f"\n  Course ID: {lesson.get('courseId')}")
    print(f"  Title: {lesson.get('title')}")

