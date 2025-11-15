from pymongo import MongoClient
from datetime import datetime
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'eduequi')

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

# Collections
courses_collection = db['courses']
lessons_collection = db['lessons']
videos_collection = db['videos']
quizzes_collection = db['quizzes']
student_progress_collection = db['student_progress']

class CourseModel:
    @staticmethod
    def create(course_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new course"""
        course = {
            'title': course_data['title'],
            'titleTamil': course_data.get('titleTamil', ''),
            'description': course_data['description'],
            'difficulty': course_data['difficulty'],
            'category': course_data['category'],
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        }
        result = courses_collection.insert_one(course)
        course['_id'] = str(result.inserted_id)
        course['id'] = str(result.inserted_id)
        return course
    
    @staticmethod
    def get_all() -> List[Dict[str, Any]]:
        """Get all courses"""
        courses = list(courses_collection.find())
        for course in courses:
            course['id'] = str(course['_id'])
            course['_id'] = str(course['_id'])
        return courses
    
    @staticmethod
    def get_by_id(course_id: str) -> Optional[Dict[str, Any]]:
        """Get course by ID"""
        from bson import ObjectId
        try:
            course = courses_collection.find_one({'_id': ObjectId(course_id)})
            if course:
                course['id'] = str(course['_id'])
                course['_id'] = str(course['_id'])
            return course
        except:
            return None
    
    @staticmethod
    def update(course_id: str, course_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a course"""
        from bson import ObjectId
        try:
            update_data = {k: v for k, v in course_data.items() if v is not None}
            update_data['updatedAt'] = datetime.now().isoformat()
            
            result = courses_collection.update_one(
                {'_id': ObjectId(course_id)},
                {'$set': update_data}
            )
            if result.modified_count > 0:
                return CourseModel.get_by_id(course_id)
            return None
        except:
            return None
    
    @staticmethod
    def delete(course_id: str) -> bool:
        """Delete a course and its associated lessons, videos, and quizzes"""
        from bson import ObjectId
        try:
            # Delete course
            courses_collection.delete_one({'_id': ObjectId(course_id)})
            # Delete associated lessons
            lessons_collection.delete_many({'courseId': course_id})
            # Delete associated videos
            videos_collection.delete_many({'courseId': course_id})
            # Delete associated quizzes
            quizzes_collection.delete_many({'courseId': course_id})
            return True
        except:
            return False

class LessonModel:
    @staticmethod
    def create(lesson_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new lesson"""
        lesson = {
            'courseId': lesson_data['courseId'],
            'title': lesson_data['title'],
            'titleTamil': lesson_data.get('titleTamil', ''),
            'content': lesson_data['content'],
            'contentTamil': lesson_data.get('contentTamil', ''),
            'order': lesson_data.get('order', 0),
            'videoId': lesson_data.get('videoId'),
            'quizId': lesson_data.get('quizId'),
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        }
        result = lessons_collection.insert_one(lesson)
        lesson['_id'] = str(result.inserted_id)
        lesson['id'] = str(result.inserted_id)
        return lesson
    
    @staticmethod
    def get_by_course(course_id: str) -> List[Dict[str, Any]]:
        """Get all lessons for a course, ordered by order field"""
        lessons = list(lessons_collection.find({'courseId': course_id}).sort('order', 1))
        for lesson in lessons:
            lesson['id'] = str(lesson['_id'])
            lesson['_id'] = str(lesson['_id'])
        return lessons
    
    @staticmethod
    def get_by_id(lesson_id: str) -> Optional[Dict[str, Any]]:
        """Get lesson by ID"""
        from bson import ObjectId
        try:
            lesson = lessons_collection.find_one({'_id': ObjectId(lesson_id)})
            if lesson:
                lesson['id'] = str(lesson['_id'])
                lesson['_id'] = str(lesson['_id'])
            return lesson
        except:
            return None
    
    @staticmethod
    def update(lesson_id: str, lesson_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a lesson"""
        from bson import ObjectId
        try:
            update_data = {k: v for k, v in lesson_data.items() if v is not None}
            update_data['updatedAt'] = datetime.now().isoformat()
            
            result = lessons_collection.update_one(
                {'_id': ObjectId(lesson_id)},
                {'$set': update_data}
            )
            if result.modified_count > 0:
                return LessonModel.get_by_id(lesson_id)
            return None
        except:
            return None
    
    @staticmethod
    def delete(lesson_id: str) -> bool:
        """Delete a lesson"""
        from bson import ObjectId
        try:
            lessons_collection.delete_one({'_id': ObjectId(lesson_id)})
            return True
        except:
            return False

class VideoModel:
    @staticmethod
    def create(video_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new video"""
        video = {
            'courseId': video_data['courseId'],
            'lessonId': video_data.get('lessonId'),
            'title': video_data['title'],
            'videoUrl': video_data['videoUrl'],
            'islVideoUrl': video_data.get('islVideoUrl', video_data['videoUrl']),
            'description': video_data.get('description', ''),
            'createdAt': datetime.now().isoformat()
        }
        result = videos_collection.insert_one(video)
        video['_id'] = str(result.inserted_id)
        video['id'] = str(result.inserted_id)
        return video
    
    @staticmethod
    def get_by_course(course_id: str) -> List[Dict[str, Any]]:
        """Get all videos for a course"""
        videos = list(videos_collection.find({'courseId': course_id}))
        for video in videos:
            video['id'] = str(video['_id'])
            video['_id'] = str(video['_id'])
        return videos
    
    @staticmethod
    def get_by_lesson(lesson_id: str) -> Optional[Dict[str, Any]]:
        """Get video for a lesson"""
        video = videos_collection.find_one({'lessonId': lesson_id})
        if video:
            video['id'] = str(video['_id'])
            video['_id'] = str(video['_id'])
        return video
    
    @staticmethod
    def get_by_id(video_id: str) -> Optional[Dict[str, Any]]:
        """Get video by ID"""
        from bson import ObjectId
        try:
            video = videos_collection.find_one({'_id': ObjectId(video_id)})
            if video:
                video['id'] = str(video['_id'])
                video['_id'] = str(video['_id'])
            return video
        except:
            return None
    
    @staticmethod
    def delete(video_id: str) -> bool:
        """Delete a video"""
        from bson import ObjectId
        try:
            videos_collection.delete_one({'_id': ObjectId(video_id)})
            return True
        except:
            return False

class QuizModel:
    @staticmethod
    def create(quiz_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new quiz"""
        quiz = {
            'courseId': quiz_data['courseId'],
            'lessonId': quiz_data.get('lessonId'),
            'title': quiz_data['title'],
            'questions': quiz_data['questions'],
            'createdAt': datetime.now().isoformat()
        }
        result = quizzes_collection.insert_one(quiz)
        quiz['_id'] = str(result.inserted_id)
        quiz['id'] = str(result.inserted_id)
        return quiz
    
    @staticmethod
    def get_by_course(course_id: str) -> List[Dict[str, Any]]:
        """Get all quizzes for a course"""
        quizzes = list(quizzes_collection.find({'courseId': course_id}))
        for quiz in quizzes:
            quiz['id'] = str(quiz['_id'])
            quiz['_id'] = str(quiz['_id'])
        return quizzes
    
    @staticmethod
    def get_by_lesson(lesson_id: str) -> Optional[Dict[str, Any]]:
        """Get quiz for a lesson"""
        quiz = quizzes_collection.find_one({'lessonId': lesson_id})
        if quiz:
            quiz['id'] = str(quiz['_id'])
            quiz['_id'] = str(quiz['_id'])
        return quiz
    
    @staticmethod
    def update(quiz_id: str, quiz_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a quiz"""
        from bson import ObjectId
        try:
            update_data = {k: v for k, v in quiz_data.items() if v is not None}
            
            result = quizzes_collection.update_one(
                {'_id': ObjectId(quiz_id)},
                {'$set': update_data}
            )
            if result.modified_count > 0:
                return QuizModel.get_by_id(quiz_id)
            return None
        except:
            return None
    
    @staticmethod
    def get_by_id(quiz_id: str) -> Optional[Dict[str, Any]]:
        """Get quiz by ID"""
        from bson import ObjectId
        try:
            quiz = quizzes_collection.find_one({'_id': ObjectId(quiz_id)})
            if quiz:
                quiz['id'] = str(quiz['_id'])
                quiz['_id'] = str(quiz['_id'])
            return quiz
        except:
            return None
    
    @staticmethod
    def delete(quiz_id: str) -> bool:
        """Delete a quiz"""
        from bson import ObjectId
        try:
            quizzes_collection.delete_one({'_id': ObjectId(quiz_id)})
            return True
        except:
            return False

