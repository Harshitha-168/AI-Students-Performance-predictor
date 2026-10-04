from typing import Dict, Any, List, Optional
from core.db import get_db
from modules.module1_students.service import StudentService
from modules.module2_prediction.service import PredictionService
from modules.module3_suggestions.recommendation_engine import IntelligentRecommendationEngine

class SuggestionsService:
    @staticmethod
    def get_suggestions_for_student(student_id: int, semester: Optional[int] = None) -> Optional[Dict[str, Any]]:
        """Fetch student data, run Module 2 prediction, and generate personalized improvement plan."""
        student = StudentService.get_student_by_id(student_id)
        if not student:
            return None

        # Run or fetch Module 2 prediction
        prediction_result = PredictionService.predict_for_student(student_id, semester=semester)
        if not prediction_result:
            return None

        target_record = prediction_result.get('academic_record', {})

        # Generate intelligent suggestions
        suggestions = IntelligentRecommendationEngine.generate_recommendations(target_record, prediction_result)
        
        suggestions['student'] = {
            'id': student['id'],
            'full_name': student['full_name'],
            'register_number': student['register_number'],
            'department': student['department'],
            'year': student['year'],
            'semester': target_record.get('semester', student['semester'])
        }
        suggestions['prediction'] = prediction_result
        return suggestions

    @staticmethod
    def get_cohort_suggestions_summary() -> Dict[str, Any]:
        """Aggregate priority recommendations across all enrolled students for faculty dashboard."""
        students = StudentService.get_all_students()
        critical_students = []
        attendance_warning_students = []
        weak_subject_map = {}

        for st in students:
            sug = SuggestionsService.get_suggestions_for_student(st['id'])
            if not sug:
                continue

            # Check critical risk or critical priority
            if sug.get('critical_priority_count', 0) > 0 or sug.get('prediction', {}).get('risk_code') in ('critical', 'high'):
                critical_students.append({
                    "student_id": st['id'],
                    "full_name": st['full_name'],
                    "register_number": st['register_number'],
                    "department": st['department'],
                    "risk_level": sug['prediction']['risk_level'],
                    "critical_count": sug['critical_priority_count'],
                    "potential_gain": sug['total_potential_gain']
                })

            # Check attendance recovery requirement
            if sug.get('attendance_recovery') and sug['attendance_recovery']['current_attendance'] < 75.0:
                attendance_warning_students.append({
                    "student_id": st['id'],
                    "full_name": st['full_name'],
                    "register_number": st['register_number'],
                    "attendance": sug['attendance_recovery']['current_attendance'],
                    "classes_needed": sug['attendance_recovery']['classes_to_attend']
                })

            # Tally weak subjects
            for ws in sug.get('weak_subjects', []):
                sub_name = ws['subject']
                if sub_name not in weak_subject_map:
                    weak_subject_map[sub_name] = 0
                weak_subject_map[sub_name] += 1

        top_weak_subjects = sorted([{"subject": k, "students_count": v} for k, v in weak_subject_map.items()],
                                   key=lambda x: x['students_count'], reverse=True)

        return {
            "total_students_analyzed": len(students),
            "critical_priority_students": critical_students,
            "attendance_detention_risk_students": attendance_warning_students,
            "top_institutional_weak_subjects": top_weak_subjects[:6]
        }
