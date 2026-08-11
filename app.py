# app.py
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from datetime import datetime, timedelta
import os
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///zentrack.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# ===== Database Models =====
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200))
    role = db.Column(db.String(20), default='student')
    name = db.Column(db.String(100))
    grade = db.Column(db.String(20))
    section = db.Column(db.String(20))
    avatar_url = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

class MoodEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    mood = db.Column(db.String(50))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class StressEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    level = db.Column(db.Integer)
    triggers = db.Column(db.Text)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class JournalEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    title = db.Column(db.String(200))
    content = db.Column(db.Text)
    mood_tag = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    date = db.Column(db.DateTime)
    reason = db.Column(db.String(200))
    notes = db.Column(db.Text)
    status = db.Column(db.String(20), default='scheduled')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class PomodoroSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    duration = db.Column(db.Integer)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

# ===== Login Manager =====
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ===== Routes =====
@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        # Add authentication logic here
        user = User.query.filter_by(username=username).first()
        if user:
            login_user(user)
            user.last_login = datetime.utcnow()
            db.session.commit()
            return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    # Get user data
    today = datetime.utcnow().date()
    
    # Get today's mood
    today_mood = MoodEntry.query.filter(
        MoodEntry.user_id == current_user.id,
        MoodEntry.created_at >= today
    ).order_by(MoodEntry.created_at.desc()).first()
    
    # Get today's stress
    today_stress = StressEntry.query.filter(
        StressEntry.user_id == current_user.id,
        StressEntry.created_at >= today
    ).order_by(StressEntry.created_at.desc()).first()
    
    # Get streak (simplified)
    streak_days = 7  # This would be calculated from actual data
    
    # Get recent activities
    recent_activities = [
        {'title': 'Mood logged', 'description': 'Happy', 'time': '2 hours ago', 'icon': 'smile', 'color': 'success'},
        {'title': 'Journal entry', 'description': 'Today\'s thoughts', 'time': '4 hours ago', 'icon': 'book', 'color': 'primary'},
        {'title': 'Pomodoro completed', 'description': '25 min focus', 'time': '6 hours ago', 'icon': 'clock', 'color': 'warning'},
    ]
    
    # Mock data for charts
    mood_data = [4, 3, 5, 2, 4, 5, 4]  # 1-5 scale
    stress_data = [3, 5, 7, 8, 4, 2, 3]  # 1-10 scale
    
    return render_template('dashboard.html',
        today_mood=today_mood.mood if today_mood else 'Not logged',
        today_stress=today_stress.level if today_stress else 3,
        streak_days=streak_days,
        tree_progress=85,
        recent_activities=recent_activities,
        mood_data=mood_data,
        stress_data=stress_data,
        active_page='dashboard'
    )

@app.route('/mood-tracker')
@login_required
def mood_tracker():
    return render_template('mood_tracker.html', active_page='mood-tracker')

@app.route('/stress-tracker')
@login_required
def stress_tracker():
    return render_template('stress_tracker.html', active_page='stress-tracker')

@app.route('/journal')
@login_required
def journal():
    return render_template('journal.html', active_page='journal')

@app.route('/pomodoro')
@login_required
def pomodoro():
    return render_template('pomodoro.html', active_page='pomodoro')

@app.route('/breathing')
@login_required
def breathing():
    return render_template('breathing.html', active_page='breathing')

@app.route('/kamustahan')
@login_required
def kamustahan():
    return render_template('kamustahan.html', active_page='kamustahan')

@app.route('/appointments')
@login_required
def appointments():
    return render_template('appointments.html', active_page='appointments')

@app.route('/notifications')
@login_required
def notifications():
    return render_template('notifications.html', active_page='notifications')

@app.route('/achievements')
@login_required
def achievements():
    return render_template('achievements.html', active_page='achievements')

@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html', active_page='profile')

@app.route('/settings')
@login_required
def settings():
    return render_template('settings.html', active_page='settings')

# ===== API Routes for AJAX =====
@app.route('/api/mood', methods=['POST'])
@login_required
def api_mood():
    data = request.get_json()
    mood = MoodEntry(
        user_id=current_user.id,
        mood=data.get('mood'),
        notes=data.get('notes')
    )
    db.session.add(mood)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/stress', methods=['POST'])
@login_required
def api_stress():
    data = request.get_json()
    stress = StressEntry(
        user_id=current_user.id,
        level=data.get('level'),
        triggers=json.dumps(data.get('triggers', [])),
        notes=data.get('notes')
    )
    db.session.add(stress)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/journal', methods=['POST'])
@login_required
def api_journal():
    data = request.get_json()
    journal = JournalEntry(
        user_id=current_user.id,
        title=data.get('title'),
        content=data.get('content'),
        mood_tag=data.get('mood_tag')
    )
    db.session.add(journal)
    db.session.commit()
    return jsonify({'success': True})

# ===== Initialize Database =====
def init_db():
    with app.app_context():
        db.create_all()
        
        # Create demo user if not exists
        if not User.query.filter_by(username='student').first():
            user = User(
                username='student',
                email='student@school.edu',
                name='Juan Dela Cruz',
                role='student',
                grade='Grade 10',
                section='Section A',
                password_hash='demo123'  # In production, use proper hashing
            )
            db.session.add(user)
            db.session.commit()
        
        if not User.query.filter_by(username='guidance').first():
            user = User(
                username='guidance',
                email='guidance@school.edu',
                name='Maria Santos',
                role='guidance',
                password_hash='demo123'
            )
            db.session.add(user)
            db.session.commit()
        
        if not User.query.filter_by(username='admin').first():
            user = User(
                username='admin',
                email='admin@school.edu',
                name='Admin User',
                role='admin',
                password_hash='admin123'
            )
            db.session.add(user)
            db.session.commit()

if __name__ == '__main__':
    init_db()
    app.run(debug=True)