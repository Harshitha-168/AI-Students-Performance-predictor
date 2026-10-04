import re
from flask import request, jsonify, session
from auth import auth_bp
from core.db import get_db
from core.auth import hash_password, verify_password, get_current_user, login_required

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()
    full_name = data.get('full_name', '').strip()
    role = data.get('role', 'student').strip().lower()
    register_number = data.get('register_number', '').strip().upper()
    department = data.get('department', 'Computer Science').strip()
    year = int(data.get('year', 1))
    semester = int(data.get('semester', 1))
    contact_number = data.get('contact_number', '').strip()

    # Validations
    if not email or not re.match(EMAIL_REGEX, email):
        return jsonify({"success": False, "error": "Valid email address is required."}), 400
    
    if not password or len(password) < 6:
        return jsonify({"success": False, "error": "Password must be at least 6 characters."}), 400

    if not full_name:
        return jsonify({"success": False, "error": "Full name is required."}), 400

    if role not in ('student', 'faculty', 'admin'):
        role = 'student'

    if role == 'student' and not register_number:
        return jsonify({"success": False, "error": "Register number is required for student registration."}), 400

    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if email exists
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            return jsonify({"success": False, "error": "An account with this email already exists."}), 409

        # If student, check if register number already exists in students table
        if role == 'student' and register_number:
            cursor.execute("SELECT id FROM students WHERE register_number = ?", (register_number,))
            if cursor.fetchone():
                return jsonify({"success": False, "error": f"Student with Register No. {register_number} is already registered."}), 409

        password_hash = hash_password(password)
        
        cursor.execute("""
            INSERT INTO users (email, password_hash, full_name, role, register_number, department)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (email, password_hash, full_name, role, register_number if role == 'student' else None, department))
        user_id = cursor.lastrowid

        # If student role, create entry in students table
        student_id = None
        if role == 'student':
            cursor.execute("""
                INSERT INTO students (user_id, register_number, full_name, email, department, year, semester, contact_number)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (user_id, register_number, full_name, email, department, year, semester, contact_number))
            student_id = cursor.lastrowid

        # Auto-login session
        session['user_id'] = user_id
        session['role'] = role
        session['email'] = email
        session['full_name'] = full_name
        session['register_number'] = register_number
        session['student_id'] = student_id

        return jsonify({
            "success": True,
            "message": "Account created successfully.",
            "user": {
                "id": user_id,
                "student_id": student_id,
                "email": email,
                "full_name": full_name,
                "role": role,
                "register_number": register_number,
                "department": department
            }
        }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not email or not password:
        return jsonify({"success": False, "error": "Email and password are required."}), 400

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if not user or not verify_password(password, user['password_hash']):
            return jsonify({"success": False, "error": "Invalid email or password."}), 401

        student_id = None
        if user['role'] == 'student':
            cursor.execute("SELECT id FROM students WHERE user_id = ? OR register_number = ?", (user['id'], user['register_number']))
            st = cursor.fetchone()
            if st:
                student_id = st['id']

        session['user_id'] = user['id']
        session['role'] = user['role']
        session['email'] = user['email']
        session['full_name'] = user['full_name']
        session['register_number'] = user['register_number']
        session['student_id'] = student_id

        return jsonify({
            "success": True,
            "message": f"Welcome back, {user['full_name']}!",
            "user": {
                "id": user['id'],
                "student_id": student_id,
                "email": user['email'],
                "full_name": user['full_name'],
                "role": user['role'],
                "register_number": user['register_number'],
                "department": user['department']
            }
        })

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"success": True, "message": "Successfully logged out."})

@auth_bp.route('/me', methods=['GET'])
def get_profile():
    user = get_current_user()
    if not user:
        return jsonify({"success": True, "user": None, "authenticated": False})
    
    student_profile = None
    if user['role'] == 'student':
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM students WHERE user_id = ? OR register_number = ?", (user['id'], user['register_number']))
            st = cursor.fetchone()
            if st:
                student_profile = dict(st)
                user['student_id'] = student_profile['id']

    return jsonify({
        "success": True,
        "authenticated": True,
        "user": user,
        "student_profile": student_profile
    })
