import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models import CourseModel, db

courses = CourseModel.get_all()
print("\nCourse IDs and Titles:")
print("=" * 60)
for course in courses:
    course_id = str(course.get('_id', 'N/A'))
    title = course.get('title', 'N/A')
    print(f"ID: {course_id}")
    print(f"Title: {title}")
    print("-" * 60)

