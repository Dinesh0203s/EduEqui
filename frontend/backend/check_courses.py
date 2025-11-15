import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models import CourseModel

courses = CourseModel.get_all()
print("\nAll courses in database:")
for course in courses:
    print(f"  - Title: {course.get('title', 'N/A')}")
    print(f"    Category: {course.get('category', 'N/A')}")
    print()

