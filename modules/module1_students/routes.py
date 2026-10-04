from flask import request, jsonify, session
from modules.module1_students import module1_bp
from modules.module1_students.service import StudentService, AcademicRecordService
from core.auth import login_required, role_required

# --- Student Endpoints ---

@module1_bp.route('/students', methods=['GET'])
@login_required
def list_students():
    search = request.args.get('search', '')
    department = request.args.get('department', '')
    year = request.args.get('year', '')
    semester = request.args.get('semester', '')
    
    # If student role, they only view themselves unless permitted
    user_role = session.get('role')
    user_regno = session.get('register_number')
    
    if user_role == 'student' and user_regno:
        students = StudentService.get_all_students(search=user_regno)
    else:
        students = StudentService.get_all_students(search=search, department=department, year=year, semester=semester)
        
    return jsonify({"success": True, "count": len(students), "students": students})

@module1_bp.route('/students/<int:student_id>', methods=['GET'])
@login_required
def get_student(student_id):
    student = StudentService.get_student_by_id(student_id)
    if not student:
        return jsonify({"success": False, "error": "Student not found"}), 404
        
    # Student role can only inspect their own profile
    if session.get('role') == 'student' and session.get('register_number') != student.get('register_number'):
        return jsonify({"success": False, "error": "Access denied"}), 403
        
    return jsonify({"success": True, "student": student})

@module1_bp.route('/students', methods=['POST'])
@login_required
@role_required('admin', 'faculty')
def create_student():
    data = request.get_json() or {}
    reg_no = data.get('register_number', '').strip().upper()
    if not reg_no or not data.get('full_name') or not data.get('email'):
        return jsonify({"success": False, "error": "Register number, full name, and email are required"}), 400

    existing = StudentService.get_student_by_regno(reg_no)
    if existing:
        return jsonify({"success": False, "error": f"Student with Register No. {reg_no} already exists"}), 409

    try:
        new_id = StudentService.create_student(data)
        return jsonify({"success": True, "message": "Student created successfully", "student_id": new_id}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@module1_bp.route('/students/<int:student_id>', methods=['PUT'])
@login_required
def update_student(student_id):
    data = request.get_json() or {}
    student = StudentService.get_student_by_id(student_id)
    if not student:
        return jsonify({"success": False, "error": "Student not found"}), 404

    # Allow student to update their contact, or faculty/admin to update all
    if session.get('role') == 'student' and session.get('register_number') != student.get('register_number'):
        return jsonify({"success": False, "error": "Access denied"}), 403

    success = StudentService.update_student(student_id, data)
    return jsonify({"success": success, "message": "Student updated successfully" if success else "Failed to update"})

@module1_bp.route('/students/<int:student_id>', methods=['DELETE'])
@login_required
@role_required('admin', 'faculty')
def delete_student(student_id):
    success = StudentService.delete_student(student_id)
    if not success:
        return jsonify({"success": False, "error": "Student not found or deletion failed"}), 404
    return jsonify({"success": True, "message": "Student and all associated academic records deleted successfully"})


# --- Academic Records Endpoints ---

@module1_bp.route('/academic-records', methods=['POST'])
@login_required
def save_academic_record():
    data = request.get_json() or {}
    student_id = data.get('student_id')
    if not student_id:
        return jsonify({"success": False, "error": "Student ID is required"}), 400

    student = StudentService.get_student_by_id(student_id)
    if not student:
        return jsonify({"success": False, "error": "Associated student not found"}), 404

    # Check permission
    if session.get('role') == 'student' and session.get('register_number') != student.get('register_number'):
        return jsonify({"success": False, "error": "Access denied"}), 403

    # Add student metadata if missing in payload
    if not data.get('register_number'):
        data['register_number'] = student['register_number']
    if not data.get('department'):
        data['department'] = student['department']
    if not data.get('year'):
        data['year'] = student['year']

    try:
        record_id = AcademicRecordService.create_or_update_record(data)
        return jsonify({"success": True, "message": "Academic record saved successfully", "record_id": record_id}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@module1_bp.route('/academic-records/<int:record_id>', methods=['GET'])
@login_required
def get_academic_record(record_id):
    record = AcademicRecordService.get_record_by_id(record_id)
    if not record:
        return jsonify({"success": False, "error": "Record not found"}), 404
    return jsonify({"success": True, "record": record})

@module1_bp.route('/academic-records/<int:record_id>', methods=['DELETE'])
@login_required
@role_required('admin', 'faculty')
def delete_academic_record(record_id):
    success = AcademicRecordService.delete_record(record_id)
    if not success:
        return jsonify({"success": False, "error": "Record not found or deletion failed"}), 404
    return jsonify({"success": True, "message": "Academic record deleted successfully"})

@module1_bp.route('/stats', methods=['GET'])
@login_required
def get_stats():
    stats = AcademicRecordService.get_overall_stats()
    return jsonify({"success": True, "stats": stats})
