import io
import csv
import json
from typing import Dict, Any, List, Optional
from core.db import get_db
from modules.module1_students.service import StudentService
from modules.module2_prediction.service import PredictionService
from modules.module3_suggestions.service import SuggestionsService

class ReportsService:
    @staticmethod
    def get_comprehensive_analytics(department: str = "", year: str = "", semester: str = "") -> Dict[str, Any]:
        """Fetch multi-dimensional analytics for the performance dashboard."""
        with get_db() as conn:
            cursor = conn.cursor()

            # Base query for students and academic records
            query = """
                SELECT s.id AS student_id, s.register_number, s.full_name, s.department, s.year, s.semester,
                       ar.id AS record_id, ar.attendance_pct, ar.assignment_score, ar.internal_score, 
                       ar.previous_sem_score, ar.calculated_avg, ar.subject_marks_json
                FROM students s
                LEFT JOIN academic_records ar ON ar.student_id = s.id 
                     AND ar.semester = (SELECT MAX(semester) FROM academic_records WHERE student_id = s.id)
                WHERE 1=1
            """
            params = []
            if department and department != 'all':
                query += " AND s.department = ?"
                params.append(department)
            if year and year != 'all':
                query += " AND s.year = ?"
                params.append(int(year))
            if semester and semester != 'all':
                query += " AND s.semester = ?"
                params.append(int(semester))

            cursor.execute(query, params)
            rows = cursor.fetchall()

            student_metrics = []
            attendance_vs_marks = []
            subject_aggregates = {}
            risk_counts = {"Low Risk": 0, "Moderate Risk": 0, "High Risk": 0, "Critical Risk": 0}
            tier_counts = {"High": 0, "Medium": 0, "Low": 0}

            for row in rows:
                r = dict(row)
                att = float(r.get('attendance_pct') or 75.0)
                asn = float(r.get('assignment_score') or 70.0)
                itr = float(r.get('internal_score') or 70.0)
                prv = float(r.get('previous_sem_score') or 70.0)

                try:
                    subject_marks = json.loads(r.get('subject_marks_json') or '[]')
                except Exception:
                    subject_marks = []

                # Run prediction
                pred = PredictionService.simulate_custom_prediction({
                    'attendance_pct': att,
                    'assignment_score': asn,
                    'internal_score': itr,
                    'previous_sem_score': prv,
                    'subject_marks': subject_marks
                })

                pred_score = pred['predicted_percentage']
                risk = pred['risk_level']
                tier = pred['performance_tier']

                risk_counts[risk] = risk_counts.get(risk, 0) + 1
                tier_counts[tier] = tier_counts.get(tier, 0) + 1

                attendance_vs_marks.append({
                    "name": r['full_name'],
                    "reg_no": r['register_number'],
                    "department": r['department'],
                    "attendance": att,
                    "predicted_score": pred_score,
                    "risk": risk
                })

                # Tally subject scores
                for sm in subject_marks:
                    sub_name = sm.get('subject_name', 'Subject')
                    sub_obt = float(sm.get('marks_obtained', 0))
                    sub_max = float(sm.get('max_marks', 100))
                    pct = (sub_obt / sub_max) * 100.0 if sub_max > 0 else 0
                    if sub_name not in subject_aggregates:
                        subject_aggregates[sub_name] = []
                    subject_aggregates[sub_name].append(pct)

                student_metrics.append({
                    "student_id": r['student_id'],
                    "register_number": r['register_number'],
                    "full_name": r['full_name'],
                    "department": r['department'],
                    "year": r['year'],
                    "semester": r['semester'],
                    "attendance": att,
                    "internals": itr,
                    "predicted_score": pred_score,
                    "risk_level": risk,
                    "tier": tier
                })

            # Calculate Semester progression averages
            cursor.execute("""
                SELECT semester, AVG(attendance_pct) as avg_att, AVG(calculated_avg) as avg_score, AVG(internal_score) as avg_int
                FROM academic_records
                GROUP BY semester
                ORDER BY semester ASC
            """)
            sem_rows = cursor.fetchall()
            semester_progression = [
                {
                    "semester": f"Sem {sr['semester']}",
                    "avg_attendance": round(sr['avg_att'] or 0, 1),
                    "avg_score": round(sr['avg_score'] or 0, 1),
                    "avg_internal": round(sr['avg_int'] or 0, 1)
                }
                for sr in sem_rows
            ]

            # Formulate Subject Averages
            subject_charts = [
                {"subject": k, "average_score": round(sum(v) / len(v), 1), "students_count": len(v)}
                for k, v in subject_aggregates.items()
            ]
            subject_charts.sort(key=lambda x: x['average_score'], reverse=True)

            total_st = len(student_metrics)
            avg_pred = round(sum(s['predicted_score'] for s in student_metrics) / total_st, 1) if total_st else 0
            avg_att_overall = round(sum(s['attendance'] for s in student_metrics) / total_st, 1) if total_st else 0
            pass_rate = round((sum(1 for s in student_metrics if s['predicted_score'] >= 50.0) / total_st) * 100.0, 1) if total_st else 0

            return {
                "summary": {
                    "total_students": total_st,
                    "average_predicted_score": avg_pred,
                    "average_attendance": avg_att_overall,
                    "forecast_pass_rate": pass_rate,
                    "critical_risk_count": risk_counts.get("Critical Risk", 0),
                    "high_risk_count": risk_counts.get("High Risk", 0)
                },
                "risk_distribution": risk_counts,
                "tier_distribution": tier_counts,
                "attendance_vs_marks": attendance_vs_marks,
                "semester_progression": semester_progression,
                "subject_averages": subject_charts[:8],
                "student_roster": student_metrics
            }

    @staticmethod
    def generate_csv_data(department: str = "", year: str = "", semester: str = "") -> str:
        """Generate structured CSV dataset for download."""
        analytics = ReportsService.get_comprehensive_analytics(department, year, semester)
        roster = analytics.get('student_roster', [])

        output = io.StringIO()
        writer = csv.writer(output)

        # Write CSV Header
        writer.writerow([
            "Register Number", "Full Name", "Department", "Year", "Semester",
            "Attendance (%)", "Internal Marks (%)", "Predicted Score (%)", "Performance Tier", "Risk Level"
        ])

        for st in roster:
            writer.writerow([
                st['register_number'],
                st['full_name'],
                st['department'],
                st['year'],
                st['semester'],
                st['attendance'],
                st['internals'],
                st['predicted_score'],
                st['tier'],
                st['risk_level']
            ])

        return output.getvalue()

    @staticmethod
    def generate_transcript_data(student_id: int) -> Optional[Dict[str, Any]]:
        """Fetch all historical records, ML prediction, and suggestions for printable transcript."""
        student = StudentService.get_student_by_id(student_id)
        if not student:
            return None

        prediction = PredictionService.predict_for_student(student_id)
        suggestions = SuggestionsService.get_suggestions_for_student(student_id)

        return {
            "institution": "AI Institute of Technology & Engineering",
            "document_title": "Official Student Academic Performance & AI Intelligence Transcript",
            "student": student,
            "prediction": prediction,
            "suggestions": suggestions,
            "academic_records": student.get('academic_records', [])
        }
