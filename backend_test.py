#!/usr/bin/env python3
"""
Backend API Testing for EduEqui Application
Tests TTS, Status Check, and Root endpoints
"""

import requests
import json
import base64
import os
from datetime import datetime
import sys

# Get backend URL from environment
BACKEND_URL = "https://replicate-it.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class BackendTester:
    def __init__(self):
        self.results = {
            "total_tests": 0,
            "passed": 0,
            "failed": 0,
            "errors": []
        }
        
    def log_result(self, test_name, success, message="", response_data=None):
        """Log test result"""
        self.results["total_tests"] += 1
        if success:
            self.results["passed"] += 1
            print(f"✅ {test_name}: PASSED - {message}")
        else:
            self.results["failed"] += 1
            self.results["errors"].append(f"{test_name}: {message}")
            print(f"❌ {test_name}: FAILED - {message}")
            if response_data:
                print(f"   Response: {response_data}")
    
    def test_root_endpoint(self):
        """Test GET /api/ endpoint"""
        print("\n=== Testing Root Endpoint ===")
        try:
            response = requests.get(f"{API_BASE}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_result("Root Endpoint", True, f"Status: {response.status_code}, Message: {data['message']}")
                else:
                    self.log_result("Root Endpoint", False, f"Missing 'message' field in response: {data}")
            else:
                self.log_result("Root Endpoint", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Root Endpoint", False, f"Connection error: {str(e)}")
    
    def test_status_endpoints(self):
        """Test POST and GET /api/status endpoints"""
        print("\n=== Testing Status Endpoints ===")
        
        # Test POST /api/status
        try:
            test_data = {"client_name": "EduEqui_Test_Client"}
            response = requests.post(
                f"{API_BASE}/status", 
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["id", "client_name", "timestamp"]
                if all(field in data for field in required_fields):
                    self.log_result("POST Status", True, f"Created status check with ID: {data['id']}")
                else:
                    self.log_result("POST Status", False, f"Missing required fields in response: {data}")
            else:
                self.log_result("POST Status", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("POST Status", False, f"Connection error: {str(e)}")
        
        # Test GET /api/status
        try:
            response = requests.get(f"{API_BASE}/status", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("GET Status", True, f"Retrieved {len(data)} status checks")
                else:
                    self.log_result("GET Status", False, f"Expected list, got: {type(data)}")
            else:
                self.log_result("GET Status", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("GET Status", False, f"Connection error: {str(e)}")
    
    def test_tts_endpoint(self):
        """Test POST /api/tts endpoint with various scenarios"""
        print("\n=== Testing TTS Endpoint ===")
        
        # Test 1: Basic English TTS
        try:
            test_data = {
                "text": "Hello, this is a test of the text to speech functionality.",
                "language": "en",
                "speed": 1.0
            }
            response = requests.post(
                f"{API_BASE}/tts",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if "audio_base64" in data and "format" in data:
                    # Validate base64 audio
                    try:
                        audio_data = base64.b64decode(data["audio_base64"])
                        if len(audio_data) > 0:
                            self.log_result("TTS English", True, f"Generated {len(audio_data)} bytes of MP3 audio")
                        else:
                            self.log_result("TTS English", False, "Empty audio data returned")
                    except Exception as decode_error:
                        self.log_result("TTS English", False, f"Invalid base64 audio: {decode_error}")
                else:
                    self.log_result("TTS English", False, f"Missing required fields in response: {data}")
            else:
                self.log_result("TTS English", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("TTS English", False, f"Connection error: {str(e)}")
        
        # Test 2: Tamil TTS
        try:
            test_data = {
                "text": "வணக்கம், இது தமிழ் மொழியில் உரையை பேச்சாக மாற்றும் சோதனை.",
                "language": "ta",
                "speed": 1.0
            }
            response = requests.post(
                f"{API_BASE}/tts",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if "audio_base64" in data:
                    try:
                        audio_data = base64.b64decode(data["audio_base64"])
                        if len(audio_data) > 0:
                            self.log_result("TTS Tamil", True, f"Generated {len(audio_data)} bytes of MP3 audio")
                        else:
                            self.log_result("TTS Tamil", False, "Empty audio data returned")
                    except Exception as decode_error:
                        self.log_result("TTS Tamil", False, f"Invalid base64 audio: {decode_error}")
                else:
                    self.log_result("TTS Tamil", False, f"Missing audio_base64 in response: {data}")
            else:
                self.log_result("TTS Tamil", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("TTS Tamil", False, f"Connection error: {str(e)}")
        
        # Test 3: Different speeds
        for speed in [0.5, 2.0]:
            try:
                test_data = {
                    "text": f"Testing speech speed at {speed}x rate.",
                    "language": "en",
                    "speed": speed
                }
                response = requests.post(
                    f"{API_BASE}/tts",
                    json=test_data,
                    headers={"Content-Type": "application/json"},
                    timeout=30
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if "audio_base64" in data:
                        audio_data = base64.b64decode(data["audio_base64"])
                        self.log_result(f"TTS Speed {speed}x", True, f"Generated {len(audio_data)} bytes")
                    else:
                        self.log_result(f"TTS Speed {speed}x", False, f"Missing audio_base64: {data}")
                else:
                    self.log_result(f"TTS Speed {speed}x", False, f"Status: {response.status_code}", response.text)
            except Exception as e:
                self.log_result(f"TTS Speed {speed}x", False, f"Error: {str(e)}")
    
    def test_tts_error_handling(self):
        """Test TTS endpoint error scenarios"""
        print("\n=== Testing TTS Error Handling ===")
        
        # Test 1: Empty text
        try:
            test_data = {"text": "", "language": "en"}
            response = requests.post(
                f"{API_BASE}/tts",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 422:  # Validation error expected
                self.log_result("TTS Empty Text", True, "Correctly rejected empty text")
            else:
                self.log_result("TTS Empty Text", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_result("TTS Empty Text", False, f"Error: {str(e)}")
        
        # Test 2: Invalid speed
        try:
            test_data = {"text": "Test", "language": "en", "speed": 3.0}  # Above max 2.0
            response = requests.post(
                f"{API_BASE}/tts",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 422:  # Validation error expected
                self.log_result("TTS Invalid Speed", True, "Correctly rejected invalid speed")
            else:
                self.log_result("TTS Invalid Speed", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_result("TTS Invalid Speed", False, f"Error: {str(e)}")
        
        # Test 3: Missing required field
        try:
            test_data = {"language": "en"}  # Missing text field
            response = requests.post(
                f"{API_BASE}/tts",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 422:  # Validation error expected
                self.log_result("TTS Missing Text", True, "Correctly rejected missing text field")
            else:
                self.log_result("TTS Missing Text", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_result("TTS Missing Text", False, f"Error: {str(e)}")
    
    def test_courses_endpoint(self):
        """Test GET /api/courses endpoint"""
        print("\n=== Testing Courses Endpoint ===")
        try:
            response = requests.get(f"{API_BASE}/courses", timeout=15)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) >= 4:  # Should have Maths, Science, English, Tamil
                        # Check for expected courses
                        course_ids = [course.get('id') for course in data]
                        expected_courses = ['course-maths', 'course-science', 'course-english', 'course-tamil']
                        
                        found_courses = [cid for cid in expected_courses if cid in course_ids]
                        if len(found_courses) >= 4:
                            self.log_result("GET Courses", True, f"Found {len(data)} courses including all expected ones")
                            
                            # Validate course structure
                            sample_course = data[0]
                            required_fields = ['id', 'name', 'name_tamil', 'description', 'description_tamil', 'icon', 'color', 'lesson_count']
                            missing_fields = [field for field in required_fields if field not in sample_course]
                            
                            if not missing_fields:
                                self.log_result("Course Structure", True, "All required fields present in course objects")
                            else:
                                self.log_result("Course Structure", False, f"Missing fields: {missing_fields}")
                        else:
                            self.log_result("GET Courses", False, f"Missing expected courses. Found: {found_courses}")
                    else:
                        self.log_result("GET Courses", False, f"Expected at least 4 courses, got {len(data)}")
                else:
                    self.log_result("GET Courses", False, f"Expected list, got: {type(data)}")
            else:
                self.log_result("GET Courses", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("GET Courses", False, f"Connection error: {str(e)}")
    
    def test_specific_course_endpoint(self):
        """Test GET /api/courses/{course_id} endpoint"""
        print("\n=== Testing Specific Course Endpoint ===")
        
        # Test with course-maths
        try:
            response = requests.get(f"{API_BASE}/courses/course-maths", timeout=10)
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'name', 'name_tamil', 'description', 'description_tamil', 'icon', 'color', 'lesson_count']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    if data.get('id') == 'course-maths' and data.get('name') == 'Mathematics':
                        self.log_result("GET Course Maths", True, f"Retrieved course: {data.get('name')} ({data.get('name_tamil')})")
                    else:
                        self.log_result("GET Course Maths", False, f"Incorrect course data: {data}")
                else:
                    self.log_result("GET Course Maths", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("GET Course Maths", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("GET Course Maths", False, f"Connection error: {str(e)}")
        
        # Test with non-existent course
        try:
            response = requests.get(f"{API_BASE}/courses/non-existent-course", timeout=10)
            if response.status_code == 404:
                self.log_result("GET Non-existent Course", True, "Correctly returned 404 for non-existent course")
            else:
                self.log_result("GET Non-existent Course", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_result("GET Non-existent Course", False, f"Connection error: {str(e)}")
    
    def test_course_lessons_endpoint(self):
        """Test GET /api/courses/{course_id}/lessons endpoint"""
        print("\n=== Testing Course Lessons Endpoint ===")
        try:
            response = requests.get(f"{API_BASE}/courses/course-maths/lessons", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) >= 3:  # Should have 3 math lessons
                        self.log_result("GET Maths Lessons", True, f"Retrieved {len(data)} lessons for Mathematics")
                        
                        # Validate lesson structure
                        sample_lesson = data[0]
                        required_fields = ['id', 'course_id', 'title', 'title_tamil', 'description', 'description_tamil', 
                                         'video_url', 'transcriptions', 'content_text', 'content_text_tamil', 'order']
                        missing_fields = [field for field in required_fields if field not in sample_lesson]
                        
                        if not missing_fields:
                            # Check transcriptions structure
                            transcriptions = sample_lesson.get('transcriptions', [])
                            if isinstance(transcriptions, list) and len(transcriptions) >= 2:
                                # Check for English and Tamil transcriptions
                                languages = [t.get('language') for t in transcriptions]
                                if 'en' in languages and 'ta' in languages:
                                    self.log_result("Lesson Structure", True, "Lessons have proper structure with bilingual transcriptions")
                                else:
                                    self.log_result("Lesson Structure", False, f"Missing bilingual transcriptions. Found languages: {languages}")
                            else:
                                self.log_result("Lesson Structure", False, f"Invalid transcriptions structure: {transcriptions}")
                        else:
                            self.log_result("Lesson Structure", False, f"Missing fields in lesson: {missing_fields}")
                    else:
                        self.log_result("GET Maths Lessons", False, f"Expected at least 3 lessons, got {len(data)}")
                else:
                    self.log_result("GET Maths Lessons", False, f"Expected list, got: {type(data)}")
            else:
                self.log_result("GET Maths Lessons", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("GET Maths Lessons", False, f"Connection error: {str(e)}")
    
    def test_specific_lesson_endpoint(self):
        """Test GET /api/lessons/{lesson_id} endpoint"""
        print("\n=== Testing Specific Lesson Endpoint ===")
        
        # Test with lesson-maths-1
        try:
            response = requests.get(f"{API_BASE}/lessons/lesson-maths-1", timeout=10)
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'course_id', 'title', 'title_tamil', 'description', 'description_tamil',
                                 'video_url', 'transcriptions', 'content_text', 'content_text_tamil', 'order']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    # Validate specific lesson data
                    if (data.get('id') == 'lesson-maths-1' and 
                        data.get('course_id') == 'course-maths' and
                        data.get('video_url') and
                        data.get('content_text') and
                        data.get('content_text_tamil')):
                        
                        # Check transcriptions
                        transcriptions = data.get('transcriptions', [])
                        if len(transcriptions) >= 2:
                            languages = [t.get('language') for t in transcriptions]
                            if 'en' in languages and 'ta' in languages:
                                self.log_result("GET Lesson Maths-1", True, f"Retrieved lesson: {data.get('title')} with bilingual content")
                            else:
                                self.log_result("GET Lesson Maths-1", False, f"Missing bilingual transcriptions: {languages}")
                        else:
                            self.log_result("GET Lesson Maths-1", False, f"Insufficient transcriptions: {len(transcriptions)}")
                    else:
                        self.log_result("GET Lesson Maths-1", False, f"Invalid lesson data structure")
                else:
                    self.log_result("GET Lesson Maths-1", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("GET Lesson Maths-1", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("GET Lesson Maths-1", False, f"Connection error: {str(e)}")
        
        # Test with non-existent lesson
        try:
            response = requests.get(f"{API_BASE}/lessons/non-existent-lesson", timeout=10)
            if response.status_code == 404:
                self.log_result("GET Non-existent Lesson", True, "Correctly returned 404 for non-existent lesson")
            else:
                self.log_result("GET Non-existent Lesson", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_result("GET Non-existent Lesson", False, f"Connection error: {str(e)}")
    
    def test_data_seeding(self):
        """Test that data auto-seeding works correctly"""
        print("\n=== Testing Data Auto-Seeding ===")
        try:
            # First call should trigger seeding
            response = requests.get(f"{API_BASE}/courses", timeout=15)
            if response.status_code == 200:
                data = response.json()
                if len(data) >= 4:
                    self.log_result("Data Auto-Seeding", True, f"Auto-seeding successful, found {len(data)} courses")
                    
                    # Verify specific course data
                    maths_course = next((c for c in data if c.get('id') == 'course-maths'), None)
                    if maths_course:
                        if (maths_course.get('name') == 'Mathematics' and 
                            maths_course.get('name_tamil') == 'கணிதம்' and
                            maths_course.get('lesson_count') == 3):
                            self.log_result("Seeded Data Validation", True, "Mathematics course data is correct")
                        else:
                            self.log_result("Seeded Data Validation", False, f"Incorrect maths course data: {maths_course}")
                    else:
                        self.log_result("Seeded Data Validation", False, "Mathematics course not found in seeded data")
                else:
                    self.log_result("Data Auto-Seeding", False, f"Insufficient courses after seeding: {len(data)}")
            else:
                self.log_result("Data Auto-Seeding", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Data Auto-Seeding", False, f"Connection error: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting Backend API Tests for EduEqui")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"API Base: {API_BASE}")
        print("=" * 60)
        
        # Run all test suites
        self.test_root_endpoint()
        self.test_status_endpoints()
        self.test_tts_endpoint()
        self.test_tts_error_handling()
        
        # Course Content API Tests
        self.test_data_seeding()
        self.test_courses_endpoint()
        self.test_specific_course_endpoint()
        self.test_course_lessons_endpoint()
        self.test_specific_lesson_endpoint()
        
        # Print summary
        print("\n" + "=" * 60)
        print("🏁 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.results['total_tests']}")
        print(f"Passed: {self.results['passed']}")
        print(f"Failed: {self.results['failed']}")
        
        if self.results['errors']:
            print("\n❌ FAILED TESTS:")
            for error in self.results['errors']:
                print(f"  - {error}")
        
        success_rate = (self.results['passed'] / self.results['total_tests']) * 100 if self.results['total_tests'] > 0 else 0
        print(f"\nSuccess Rate: {success_rate:.1f}%")
        
        return self.results['failed'] == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)