import json
from typing import Dict, Any, List, Optional
from core.db import get_db
from modules.module1_students.service import StudentService
from modules.module2_prediction.ml_engine import StudentPerformancePredictorML

class PredictionService:
    @staticmethod
    def predict_for_student(student_id: int, semester: Optional[int] = None) -> Optional[Dict[str, Any]]:
        """Run ML prediction on stored database records for a given student."""
        student = StudentService.get_student_by_id(student_id)
        if not student:
            return None
        
        records = student.get('academic_records', [])
        if not records:
            # Fallback default baseline record if student has no entered record yet
            target_record = {
                'student_id': student_id,
                'register_number': student['register_number'],
                'semester': student['semester'],
                'attendance_pct': 75.0,
                'assignment_score': 70.0,
                'internal_score': 70.0,
                'previous_sem_score': 70.0,
                'subject_marks': []
            }
            record_id = None
        else:
            if semester:
                matched = [r for r in records if r['semester'] == semester]
                target_record = matched[0] if matched else records[-1]
            else:
                # Latest semester record
                target_record = records[-1]
            record_id = target_record.get('id')

        # Run ML engine
        prediction_result = StudentPerformancePredictorML.predict(target_record)
        
        # Log to database predictions_history
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO predictions_history
                (student_id, academic_record_id, predicted_percentage, performance_tier, risk_level, confidence_score, key_factors_json)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                student_id,
                record_id,
                prediction_result['predicted_percentage'],
                prediction_result['performance_tier'],
                prediction_result['risk_level'],
                prediction_result['confidence_score'],
                json.dumps(prediction_result['key_factors'])
            ))
            
        prediction_result['student'] = {
            'id': student['id'],
            'full_name': student['full_name'],
            'register_number': student['register_number'],
            'department': student['department'],
            'year': student['year'],
            'semester': target_record.get('semester', student['semester'])
        }
        prediction_result['academic_record'] = target_record
        return prediction_result

    @staticmethod
    def simulate_custom_prediction(data: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate real-time prediction for interactive What-If analysis."""
        return StudentPerformancePredictorML.predict(data)

    @staticmethod
    def get_batch_predictions() -> List[Dict[str, Any]]:
        """Compute live predictions across all students for Faculty/Admin cohort view."""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT s.id, s.full_name, s.register_number, s.department, s.year, s.semester,
                       ar.id AS record_id, ar.attendance_pct, ar.assignment_score, ar.internal_score, 
                       ar.previous_sem_score, ar.subject_marks_json, ar.calculated_avg
                FROM students s
                LEFT JOIN academic_records ar ON ar.student_id = s.id 
                     AND ar.semester = (SELECT MAX(semester) FROM academic_records WHERE student_id = s.id)
                ORDER BY s.register_number ASC
            """)
            rows = cursor.fetchall()
            
            results = []
            for row in rows:
                r_dict = dict(row)
                if r_dict.get('attendance_pct') is not None:
                    try:
                        r_dict['subject_marks'] = json.loads(r_dict.get('subject_marks_json') or '[]')
                    except Exception:
                        r_dict['subject_marks'] = []
                else:
                    r_dict['attendance_pct'] = 75.0
                    r_dict['assignment_score'] = 70.0
                    r_dict['internal_score'] = 70.0
                    r_dict['previous_sem_score'] = 70.0
                    r_dict['subject_marks'] = []
                    
                pred = StudentPerformancePredictorML.predict(r_dict)
                results.append({
                    "student_id": r_dict['id'],
                    "full_name": r_dict['full_name'],
                    "register_number": r_dict['register_number'],
                    "department": r_dict['department'],
                    "year": r_dict['year'],
                    "semester": r_dict['semester'],
                    "attendance": r_dict['attendance_pct'],
                    "internals": r_dict['internal_score'],
                    "predicted_percentage": pred['predicted_percentage'],
                    "performance_tier": pred['performance_tier'],
                    "risk_level": pred['risk_level'],
                    "risk_code": pred['risk_code'],
                    "confidence_score": pred['confidence_score']
                })
            return results

    @staticmethod
    def get_prediction_history(student_id: int) -> List[Dict[str, Any]]:
        """Retrieve historical logged predictions for student."""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT ph.*, ar.semester 
                FROM predictions_history ph
                LEFT JOIN academic_records ar ON ar.id = ph.academic_record_id
                WHERE ph.student_id = ?
                ORDER BY ph.created_at DESC
                LIMIT 20
            """, (student_id,))
            rows = cursor.fetchall()
            history = []
            for row in rows:
                item = dict(row)
                try:
                    item['key_factors'] = json.loads(item['key_factors_json'])
                except Exception:
                    item['key_factors'] = []
                history.append(item)
            return history
