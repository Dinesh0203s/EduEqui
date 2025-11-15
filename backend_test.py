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
BACKEND_URL = "https://speakbot-3.preview.emergentagent.com"
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