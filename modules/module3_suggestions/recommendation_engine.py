import math
from typing import Dict, List, Any

class IntelligentRecommendationEngine:
    """
    Intelligent Academic Recommendation & Remediation Engine.
    
    Analyzes:
    1. Weakest and below-benchmark subjects (<60% or <50%)
    2. Attendance deficits (<75% statutory threshold & <85% optimal)
    3. Assignment & practical submission gaps
    4. Mid-term internal exam trends vs historical GPA
    5. Calculates priority levels (Critical, High, Medium, Low) and projected score gain.
    """

    @classmethod
    def generate_recommendations(cls, record: Dict[str, Any], prediction: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive personalized recommendations based on academic record & prediction."""
        attendance = float(record.get('attendance_pct', 75.0))
        assignment = float(record.get('assignment_score', 70.0))
        internals = float(record.get('internal_score', 70.0))
        prev_sem = float(record.get('previous_sem_score', 70.0))
        predicted_score = float(prediction.get('predicted_percentage', 70.0))
        risk_level = prediction.get('risk_level', 'Moderate Risk')

        # Parse subject marks
        subject_marks = record.get('subject_marks', [])
        if not subject_marks and 'subject_marks_json' in record:
            import json
            try:
                subject_marks = json.loads(record['subject_marks_json'])
            except Exception:
                subject_marks = []

        recommendations = []
        weak_subjects = []
        strong_subjects = []
        total_potential_gain = 0.0

        # 1. SUBJECT-WISE ANALYSIS & WEAK SUBJECT IDENTIFICATION
        for sub in subject_marks:
            name = sub.get('subject_name', 'Subject')
            obt = float(sub.get('marks_obtained', 0))
            max_m = float(sub.get('max_marks', 100))
            pct = round((obt / max_m) * 100.0, 1) if max_m > 0 else 0.0

            if pct < 50.0:
                # Critical Weak Subject
                gain = round((65.0 - pct) * 0.25, 1)
                total_potential_gain += gain
                weak_subjects.append({
                    "subject": name,
                    "current_score": pct,
                    "status": "Critical Deficit",
                    "target_score": 65.0,
                    "priority": "Critical",
                    "priority_code": "critical",
                    "estimated_gain": f"+{gain}%",
                    "weekly_study_hours": 6,
                    "action_plan": f"Urgent remediation needed in {name}. Schedule 6 hrs/week focused study, complete textbook back-of-chapter problems, and attend faculty doubt-clearing sessions.",
                    "focus_areas": ["Core fundamentals & definitions", "Solved previous 3-year exam papers", "Weekly 1-on-1 tutoring / professor office hours"]
                })
            elif pct < 65.0:
                # Moderate Weak Subject
                gain = round((75.0 - pct) * 0.2, 1)
                total_potential_gain += gain
                weak_subjects.append({
                    "subject": name,
                    "current_score": pct,
                    "status": "Needs Improvement",
                    "target_score": 75.0,
                    "priority": "High",
                    "priority_code": "high",
                    "estimated_gain": f"+{gain}%",
                    "weekly_study_hours": 4,
                    "action_plan": f"Target reaching 75%+ in {name}. Increase practice on application and numerical problems.",
                    "focus_areas": ["Application-level concept practice", "Self-assessment mock quiz before internals", "Form peer study group for complex topics"]
                })
            else:
                strong_subjects.append({
                    "subject": name,
                    "current_score": pct,
                    "status": "Strong Performance"
                })

        # 2. ATTENDANCE IMPROVEMENT & RECOVERY CALCULATOR
        attendance_rec = None
        if attendance < 75.0:
            # Below university minimum threshold
            # Assume 60 total semester lectures: calculate classes needed to hit 75%
            classes_held = 40
            classes_attended = int((attendance / 100.0) * classes_held)
            # (classes_attended + x) / (classes_held + x) = 0.75 => x = (0.75 * 40 - attended) / 0.25
            classes_needed = max(int(math.ceil((0.75 * classes_held - classes_attended) / 0.25)), 1)
            classes_needed = min(classes_needed, 20)
            
            gain = round((75.0 - attendance) * 0.35, 1)
            total_potential_gain += gain
            attendance_rec = {
                "category": "Attendance Recovery",
                "current_attendance": attendance,
                "target_attendance": 75.0,
                "classes_to_attend": classes_needed,
                "priority": "Critical" if attendance < 60.0 else "High",
                "priority_code": "critical" if attendance < 60.0 else "high",
                "estimated_gain": f"+{gain}%",
                "title": "Mandatory Attendance Restoration Plan",
                "description": f"Current attendance is {attendance}%, below statutory 75%. You must attend the next {classes_needed} consecutive lectures without absence to clear exam detention risk.",
                "action_items": [
                    f"Attend next {classes_needed} classes consecutively with 0 unexcused leaves",
                    "Submit medical certificates or approved leave slips to department head immediately",
                    "Participate actively in lab sessions to claim attendance makeup credits"
                ]
            }
            recommendations.append(attendance_rec)
        elif attendance < 85.0:
            gain = 2.5
            total_potential_gain += gain
            attendance_rec = {
                "category": "Attendance Optimization",
                "current_attendance": attendance,
                "target_attendance": 90.0,
                "classes_to_attend": 5,
                "priority": "Medium",
                "priority_code": "medium",
                "estimated_gain": f"+{gain}%",
                "title": "Attendance Distinction Target",
                "description": f"Improving attendance from {attendance}% to 90%+ unlocks internal bonus marks and reinforces theory topics.",
                "action_items": [
                    "Maintain perfect attendance for the remaining semester weeks",
                    "Sit in front rows to boost engagement during lectures"
                ]
            }
            recommendations.append(attendance_rec)

        # 3. INTERNAL MARKS & EXAM READINESS REMEDIATION
        if internals < 60.0:
            gain = round((75.0 - internals) * 0.3, 1)
            total_potential_gain += gain
            recommendations.append({
                "category": "Internal Exam Mastery",
                "priority": "Critical" if internals < 50.0 else "High",
                "priority_code": "critical" if internals < 50.0 else "high",
                "estimated_gain": f"+{gain}%",
                "title": "Mid-Term Examination Turnaround Strategy",
                "description": f"Internal test score ({internals}%) indicates conceptual knowledge gaps before final university exams.",
                "action_items": [
                    "Request answer sheet review with course instructors to pinpoint marking deductions",
                    "Solve 2 timed mock exams before next assessment cycle",
                    "Create concise formula and concept revision flashcards"
                ]
            })
        elif internals < 75.0:
            recommendations.append({
                "category": "Internal Exam Consistency",
                "priority": "Medium",
                "priority_code": "medium",
                "estimated_gain": "+3.5%",
                "title": "Internal Score Boost Strategy",
                "description": f"Currently scoring {internals}% in internals. A 10% boost directly elevates your expected final grade to High tier.",
                "action_items": [
                    "Focus on high-weightage topics in syllabus units 3 and 4",
                    "Practice step-by-step diagrammatic derivations"
                ]
            })

        # 4. ASSIGNMENTS & CONTINUOUS WORK PLAN
        if assignment < 70.0:
            gain = round((85.0 - assignment) * 0.2, 1)
            total_potential_gain += gain
            recommendations.append({
                "category": "Coursework & Assignments",
                "priority": "High" if assignment < 55.0 else "Medium",
                "priority_code": "high" if assignment < 55.0 else "medium",
                "estimated_gain": f"+{gain}%",
                "title": "Assignment & Lab Record Completion",
                "description": f"Assignment score is at {assignment}%. Coursework is the easiest component to secure 90%+ marks.",
                "action_items": [
                    "Submit all pending lab writeups and mini-project milestones before deadlines",
                    "Have assignments peer-reviewed prior to final submission",
                    "Utilize teaching assistant office hours for code/problem debugging"
                ]
            })
        else:
            recommendations.append({
                "category": "Advanced Enrichment",
                "priority": "Low",
                "priority_code": "low",
                "estimated_gain": "+2.0%",
                "title": "Honors Project & Extension Opportunities",
                "description": "Strong coursework submission history. Focus on extra credit problems and capstone project papers.",
                "action_items": [
                    "Explore optional research papers or open-source contributions",
                    "Mentor peer study groups in your strongest subjects"
                ]
            })

        # 5. OVERALL SUMMARY ROADMAP
        target_projected_score = min(round(predicted_score + min(total_potential_gain, 25.0), 1), 98.0)
        
        return {
            "student_id": record.get('student_id'),
            "semester": record.get('semester'),
            "current_predicted_score": predicted_score,
            "target_projected_score": target_projected_score,
            "total_potential_gain": f"+{round(min(total_potential_gain, 25.0), 1)}%",
            "weak_subjects": weak_subjects,
            "strong_subjects": strong_subjects,
            "attendance_recovery": attendance_rec,
            "recommendations": recommendations,
            "total_recommendations_count": len(recommendations) + len(weak_subjects),
            "critical_priority_count": sum(1 for r in recommendations if r.get('priority') == 'Critical') + sum(1 for s in weak_subjects if s.get('priority') == 'Critical'),
            "high_priority_count": sum(1 for r in recommendations if r.get('priority') == 'High') + sum(1 for s in weak_subjects if s.get('priority') == 'High'),
            "medium_priority_count": sum(1 for r in recommendations if r.get('priority') == 'Medium'),
            "low_priority_count": sum(1 for r in recommendations if r.get('priority') == 'Low')
        }
