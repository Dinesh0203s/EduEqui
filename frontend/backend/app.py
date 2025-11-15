from flask import Flask, request, send_file, jsonify
from gtts import gTTS
from io import BytesIO
from flask_cors import CORS
import os
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename
from models import CourseModel, LessonModel, VideoModel, QuizModel

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Ensure upload directory exists
UPLOAD_FOLDER = 'uploads/videos'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max file size

ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Helper function to set CORS headers
def cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

# Courses API
@app.route('/api/courses', methods=['GET', 'OPTIONS'])
def get_courses():
    if request.method == 'OPTIONS':
        return cors_headers(jsonify({}))
    courses = CourseModel.get_all()
    return cors_headers(jsonify(courses))

@app.route('/api/courses/<course_id>', methods=['GET', 'OPTIONS'])
def get_course(course_id):
    if request.method == 'OPTIONS':
        return cors_headers(jsonify({}))
    course = CourseModel.get_by_id(course_id)
    if not course:
        return cors_headers(jsonify({'error': 'Course not found'})), 404
    
    # Get lessons for this course
    lessons = LessonModel.get_by_course(course_id)
    course['lessons'] = lessons
    
    return cors_headers(jsonify(course))

@app.route('/api/courses', methods=['POST'])
def create_course():
    data = request.get_json()
    try:
        course = CourseModel.create(data)
        return cors_headers(jsonify(course)), 201
    except Exception as e:
        return cors_headers(jsonify({'error': str(e)})), 400

@app.route('/api/courses/<course_id>', methods=['PUT'])
def update_course(course_id):
    data = request.get_json()
    course = CourseModel.update(course_id, data)
    if course:
        return cors_headers(jsonify(course))
    return cors_headers(jsonify({'error': 'Course not found'})), 404

@app.route('/api/courses/<course_id>', methods=['DELETE'])
def delete_course(course_id):
    success = CourseModel.delete(course_id)
    if success:
        return cors_headers(jsonify({'message': 'Course deleted'}))
    return cors_headers(jsonify({'error': 'Course not found'})), 404

# Lessons API
@app.route('/api/lessons', methods=['GET', 'OPTIONS'])
def get_lessons():
    if request.method == 'OPTIONS':
        return cors_headers(jsonify({}))
    course_id = request.args.get('courseId')
    if course_id:
        lessons = LessonModel.get_by_course(course_id)
        return cors_headers(jsonify(lessons))
    return cors_headers(jsonify([]))

@app.route('/api/lessons/<lesson_id>', methods=['GET', 'OPTIONS'])
def get_lesson(lesson_id):
    if request.method == 'OPTIONS':
        return cors_headers(jsonify({}))
    lesson = LessonModel.get_by_id(lesson_id)
    if not lesson:
        return cors_headers(jsonify({'error': 'Lesson not found'})), 404
    
    # Get associated video and quiz if they exist
    if lesson.get('videoId'):
        video = VideoModel.get_by_id(lesson['videoId'])
        lesson['video'] = video
    if lesson.get('quizId'):
        quiz = QuizModel.get_by_id(lesson['quizId'])
        lesson['quiz'] = quiz
    
    return cors_headers(jsonify(lesson))

@app.route('/api/lessons', methods=['POST'])
def create_lesson():
    data = request.get_json()
    try:
        lesson = LessonModel.create(data)
        return cors_headers(jsonify(lesson)), 201
    except Exception as e:
        return cors_headers(jsonify({'error': str(e)})), 400

@app.route('/api/lessons/<lesson_id>', methods=['PUT'])
def update_lesson(lesson_id):
    data = request.get_json()
    lesson = LessonModel.update(lesson_id, data)
    if lesson:
        return cors_headers(jsonify(lesson))
    return cors_headers(jsonify({'error': 'Lesson not found'})), 404

@app.route('/api/lessons/<lesson_id>', methods=['DELETE'])
def delete_lesson(lesson_id):
    success = LessonModel.delete(lesson_id)
    if success:
        return cors_headers(jsonify({'message': 'Lesson deleted'}))
    return cors_headers(jsonify({'error': 'Lesson not found'})), 404

# Quizzes API
@app.route('/api/quizzes', methods=['GET', 'OPTIONS'])
def get_quizzes():
    if request.method == 'OPTIONS':
        return cors_headers(jsonify({}))
    course_id = request.args.get('courseId')
    if course_id:
        quizzes = QuizModel.get_by_course(course_id)
        return cors_headers(jsonify(quizzes))
    # Return all quizzes if no courseId specified
    from models import quizzes_collection
    quizzes = list(quizzes_collection.find())
    for quiz in quizzes:
        quiz['id'] = str(quiz['_id'])
        quiz['_id'] = str(quiz['_id'])
    return cors_headers(jsonify(quizzes))

@app.route('/api/quizzes', methods=['POST'])
def create_quiz():
    data = request.get_json()
    try:
        quiz = QuizModel.create(data)
        return cors_headers(jsonify(quiz)), 201
    except Exception as e:
        return cors_headers(jsonify({'error': str(e)})), 400

@app.route('/api/quizzes/<quiz_id>', methods=['PUT'])
def update_quiz(quiz_id):
    data = request.get_json()
    quiz = QuizModel.update(quiz_id, data)
    if quiz:
        return cors_headers(jsonify(quiz))
    return cors_headers(jsonify({'error': 'Quiz not found'})), 404

@app.route('/api/quizzes/<quiz_id>', methods=['DELETE'])
def delete_quiz(quiz_id):
    success = QuizModel.delete(quiz_id)
    if success:
        return cors_headers(jsonify({'message': 'Quiz deleted'}))
    return cors_headers(jsonify({'error': 'Quiz not found'})), 404

# Videos API
@app.route('/api/videos', methods=['GET', 'OPTIONS'])
def get_videos():
    if request.method == 'OPTIONS':
        return cors_headers(jsonify({}))
    course_id = request.args.get('courseId')
    lesson_id = request.args.get('lessonId')
    
    if lesson_id:
        video = VideoModel.get_by_lesson(lesson_id)
        return cors_headers(jsonify([video] if video else []))
    elif course_id:
        videos = VideoModel.get_by_course(course_id)
        return cors_headers(jsonify(videos))
    else:
        # Return all videos
        from models import videos_collection
        videos = list(videos_collection.find())
        for video in videos:
            video['id'] = str(video['_id'])
            video['_id'] = str(video['_id'])
        return cors_headers(jsonify(videos))

@app.route('/api/videos/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return cors_headers(jsonify({'error': 'No video file provided'})), 400
    
    file = request.files['video']
    course_id = request.form.get('courseId')
    lesson_id = request.form.get('lessonId')
    title = request.form.get('title', file.filename)
    
    if file.filename == '':
        return cors_headers(jsonify({'error': 'No file selected'})), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        
        video_data = {
            'courseId': course_id,
            'lessonId': lesson_id,
            'title': title,
            'videoUrl': f'http://localhost:5000/uploads/videos/{unique_filename}',
            'islVideoUrl': f'http://localhost:5000/uploads/videos/{unique_filename}',
            'description': request.form.get('description', '')
        }
        
        try:
            video = VideoModel.create(video_data)
            return cors_headers(jsonify(video)), 201
        except Exception as e:
            return cors_headers(jsonify({'error': str(e)})), 400
    
    return cors_headers(jsonify({'error': 'Invalid file type'})), 400

@app.route('/api/videos/<video_id>', methods=['DELETE'])
def delete_video(video_id):
    video = VideoModel.get_by_id(video_id)
    if video:
        # Delete the file from disk
        video_filename = video['videoUrl'].split('/')[-1]
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], video_filename)
        if os.path.exists(filepath):
            os.remove(filepath)
        
        success = VideoModel.delete(video_id)
        if success:
            return cors_headers(jsonify({'message': 'Video deleted'}))
    return cors_headers(jsonify({'error': 'Video not found'})), 404

# Serve uploaded videos
@app.route('/uploads/videos/<filename>')
def serve_video(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))

# Student Progress API
@app.route('/api/students/progress', methods=['GET', 'OPTIONS'])
def get_student_progress():
    if request.method == 'OPTIONS':
        return cors_headers(jsonify({}))
    # Return mock data for now
    # In production, this would query a database
    mock_progress = [
        {
            'studentId': '1',
            'studentName': 'ராஜேஷ் / Rajesh',
            'courses': [
                {
                    'courseId': 'math',
                    'courseTitle': 'Mathematics',
                    'progress': 35,
                    'completedLessons': 7,
                    'totalLessons': 20,
                    'quizScores': [
                        {
                            'quizId': '1',
                            'quizTitle': 'Basic Math Quiz',
                            'score': 8,
                            'maxScore': 10
                        }
                    ]
                },
                {
                    'courseId': 'science',
                    'courseTitle': 'Science',
                    'progress': 62,
                    'completedLessons': 12,
                    'totalLessons': 19,
                    'quizScores': [
                        {
                            'quizId': '2',
                            'quizTitle': 'Science Fundamentals',
                            'score': 9,
                            'maxScore': 10
                        }
                    ]
                }
            ]
        },
        {
            'studentId': '2',
            'studentName': 'பிரியா / Priya',
            'courses': [
                {
                    'courseId': 'language',
                    'courseTitle': 'Language Arts',
                    'progress': 48,
                    'completedLessons': 10,
                    'totalLessons': 21,
                    'quizScores': [
                        {
                            'quizId': '3',
                            'quizTitle': 'Grammar Basics',
                            'score': 7,
                            'maxScore': 10
                        }
                    ]
                }
            ]
        }
    ]
    return cors_headers(jsonify(mock_progress))

@app.route('/tts', methods=['POST', 'OPTIONS'])
def text_to_speech():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = app.make_default_options_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        return response

    try:
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        text = data.get('text', '')
        lang = data.get('lang', 'en').split('-')[0]  # Default to English, and strip country code if present
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400

        print(f"Generating speech for text: {text}")  # Debug log
            
        # Create gTTS object
        tts = gTTS(text=text, lang=lang, slow=False)
        
        # Save to bytes buffer
        audio_buffer = BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        
        # Create a response with the audio file
        response = send_file(
            audio_buffer,
            mimetype='audio/mpeg',
            as_attachment=False,
            download_name='speech.mp3'
        )
        
        # Set CORS headers
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        
        return response
        
    except Exception as e:
        print(f"Error in TTS: {str(e)}")  # Debug log
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=port, host='0.0.0.0')
