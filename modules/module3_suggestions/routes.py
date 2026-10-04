from flask import request, jsonify, session
from modules.module3_suggestions import module3_bp
from modules.module3_suggestions.service import SuggestionsService
from core.auth import login_required, role_required

@module3_bp.route('/student/<int:student_id>', methods=['GET'])
@login_required
def get_student_suggestions(student_id):
    semester = request.args.get('semester', type=int)

    # Permission check for students
    if session.get('role') == 'student' and session.get('student_id') and session.get('student_id') != student_id:
        return jsonify({"success": False, "error": "Access denied"}), 403

    result = SuggestionsService.get_suggestions_for_student(student_id, semester=semester)
    if not result:
        return jsonify({"success": False, "error": "Student not found or insufficient records"}), 404

    return jsonify({"success": True, "suggestions": result})

@module3_bp.route('/cohort-summary', methods=['GET'])
@login_required
@role_required('admin', 'faculty')
def get_cohort_summary():
    summary = SuggestionsService.get_cohort_suggestions_summary()
    return jsonify({"success": True, "summary": summary})
