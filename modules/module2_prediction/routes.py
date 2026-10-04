from flask import request, jsonify, session
from modules.module2_prediction import module2_bp
from modules.module2_prediction.service import PredictionService
from core.auth import login_required, role_required

@module2_bp.route('/student/<int:student_id>', methods=['GET'])
@login_required
def predict_student(student_id):
    semester = request.args.get('semester', type=int)
    
    # Students can only view their own prediction
    if session.get('role') == 'student' and session.get('student_id') and session.get('student_id') != student_id:
        return jsonify({"success": False, "error": "Access denied"}), 403

    result = PredictionService.predict_for_student(student_id, semester=semester)
    if not result:
        return jsonify({"success": False, "error": "Student not found or insufficient records"}), 404
        
    return jsonify({"success": True, "prediction": result})

@module2_bp.route('/simulate', methods=['POST'])
@login_required
def simulate_prediction():
    data = request.get_json() or {}
    result = PredictionService.simulate_custom_prediction(data)
    return jsonify({"success": True, "simulation": result})

@module2_bp.route('/batch', methods=['GET'])
@login_required
@role_required('admin', 'faculty')
def batch_predictions():
    results = PredictionService.get_batch_predictions()
    
    # Calculate cohort summary metrics
    total = len(results)
    high_count = sum(1 for r in results if r['performance_tier'] == 'High')
    med_count = sum(1 for r in results if r['performance_tier'] == 'Medium')
    low_count = sum(1 for r in results if r['performance_tier'] == 'Low')
    critical_count = sum(1 for r in results if r['risk_code'] == 'critical')
    
    return jsonify({
        "success": True,
        "total_students": total,
        "summary": {
            "high_performance": high_count,
            "medium_performance": med_count,
            "low_performance": low_count,
            "critical_risk": critical_count,
            "avg_predicted": round(sum(r['predicted_percentage'] for r in results) / total, 1) if total else 0
        },
        "records": results
    })

@module2_bp.route('/history/<int:student_id>', methods=['GET'])
@login_required
def prediction_history(student_id):
    if session.get('role') == 'student' and session.get('student_id') and session.get('student_id') != student_id:
        return jsonify({"success": False, "error": "Access denied"}), 403
        
    history = PredictionService.get_prediction_history(student_id)
    return jsonify({"success": True, "history": history})
