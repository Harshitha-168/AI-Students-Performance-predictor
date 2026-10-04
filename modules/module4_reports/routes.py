from flask import request, jsonify, Response, session
from modules.module4_reports import module4_bp
from modules.module4_reports.service import ReportsService
from core.auth import login_required, role_required

@module4_bp.route('/analytics', methods=['GET'])
@login_required
def get_analytics():
    department = request.args.get('department', '')
    year = request.args.get('year', '')
    semester = request.args.get('semester', '')

    data = ReportsService.get_comprehensive_analytics(department=department, year=year, semester=semester)
    return jsonify({"success": True, "analytics": data})

@module4_bp.route('/export-csv', methods=['GET'])
@login_required
@role_required('admin', 'faculty')
def export_csv():
    department = request.args.get('department', '')
    year = request.args.get('year', '')
    semester = request.args.get('semester', '')

    csv_content = ReportsService.generate_csv_data(department, year, semester)
    filename = f"Student_Performance_Report_{department or 'All'}.csv"

    return Response(
        csv_content,
        mimetype="text/csv",
        headers={"Content-disposition": f"attachment; filename={filename}"}
    )

@module4_bp.route('/transcript/<int:student_id>', methods=['GET'])
@login_required
def get_transcript(student_id):
    if session.get('role') == 'student' and session.get('student_id') and session.get('student_id') != student_id:
        return jsonify({"success": False, "error": "Access denied"}), 403

    transcript = ReportsService.generate_transcript_data(student_id)
    if not transcript:
        return jsonify({"success": False, "error": "Student transcript not found"}), 404

    return jsonify({"success": True, "transcript": transcript})
