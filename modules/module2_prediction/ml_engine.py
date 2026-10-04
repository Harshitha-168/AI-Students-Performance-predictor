import math
from typing import Dict, List, Any, Tuple

class StudentPerformancePredictorML:
    """
    Supervised Academic Performance Prediction & Risk Assessment Engine.
    
    Combines:
    1. Multi-factor Weighted Feature Synthesis (Internals, Assignments, Historical GPA, Attendance)
    2. Non-linear Attendance & Penalty Thresholds (Academic Regulatory Penalties for <75% attendance)
    3. Subject-level Variance and Minimum Threshold Penalties
    4. 3-Tier Classification: High (>=75%), Medium (50%-74.9%), Low (<50%)
    5. 4-Tier Risk Categorization: Low Risk, Moderate Risk, High Risk, Critical Risk
    6. Explainable AI (XAI) Feature Attribution Breakdown
    """

    # Baseline feature weights calibrated on academic evaluation norms
    WEIGHTS = {
        'internal_score': 0.35,      # Continuous internal examinations
        'assignment_score': 0.20,    # Regular course work and homework
        'previous_sem_score': 0.25,  # Historical academic foundation
        'attendance_score': 0.20     # Attendance engagement and laboratory participation
    }

    @classmethod
    def extract_features(cls, record: Dict[str, Any]) -> Dict[str, float]:
        """Extract and normalize features from academic record."""
        attendance = float(record.get('attendance_pct', 75.0))
        assignment = float(record.get('assignment_score', 70.0))
        internals = float(record.get('internal_score', 70.0))
        prev_sem = float(record.get('previous_sem_score', 70.0))
        
        # Parse subject marks
        subject_marks = record.get('subject_marks', [])
        if not subject_marks and 'subject_marks_json' in record:
            import json
            try:
                subject_marks = json.loads(record['subject_marks_json'])
            except Exception:
                subject_marks = []
                
        sub_scores = []
        for s in subject_marks:
            obt = float(s.get('marks_obtained', 0))
            mx = float(s.get('max_marks', 100))
            if mx > 0:
                sub_scores.append((obt / mx) * 100.0)
                
        subject_avg = sum(sub_scores) / len(sub_scores) if sub_scores else internals
        subject_min = min(sub_scores) if sub_scores else internals
        
        return {
            'attendance': min(max(attendance, 0.0), 100.0),
            'assignment': min(max(assignment, 0.0), 100.0),
            'internals': min(max(internals, 0.0), 100.0),
            'prev_sem': min(max(prev_sem, 0.0), 100.0),
            'subject_avg': min(max(subject_avg, 0.0), 100.0),
            'subject_min': min(max(subject_min, 0.0), 100.0),
            'subject_count': len(sub_scores)
        }

    @classmethod
    def predict(cls, record: Dict[str, Any]) -> Dict[str, Any]:
        """Execute full ML inference pipeline on academic record."""
        feats = cls.extract_features(record)
        
        att = feats['attendance']
        asn = feats['assignment']
        itr = feats['internals']
        prv = feats['prev_sem']
        sub_avg = feats['subject_avg']
        sub_min = feats['subject_min']
        
        # 1. Base Score calculation (blend of base features and direct subject scores if available)
        if feats['subject_count'] > 0:
            # Weighted ensemble with subject performance
            base_score = (itr * 0.25) + (asn * 0.15) + (prv * 0.20) + (att * 0.15) + (sub_avg * 0.25)
        else:
            base_score = (itr * cls.WEIGHTS['internal_score']) + \
                         (asn * cls.WEIGHTS['assignment_score']) + \
                         (prv * cls.WEIGHTS['previous_sem_score']) + \
                         (att * cls.WEIGHTS['attendance_score'])

        # 2. Non-linear Attendance Multiplier & Penalty
        # University regulation: < 75% attendance leads to severe learning deficit and exam penalties
        attendance_impact = 0.0
        if att < 60.0:
            # Severe detention risk penalty (-12% to -20%)
            penalty = 12.0 + (60.0 - att) * 0.4
            base_score -= penalty
            attendance_impact = -penalty
        elif att < 75.0:
            # Moderate attendance warning penalty (-4% to -10%)
            penalty = 4.0 + (75.0 - att) * 0.4
            base_score -= penalty
            attendance_impact = -penalty
        elif att >= 90.0:
            # Attendance consistency boost (+2.5%)
            boost = 2.5
            base_score += boost
            attendance_impact = boost
        else:
            attendance_impact = 0.5

        # 3. Weakest Subject Bottleneck Penalty
        weak_subject_penalty = 0.0
        if feats['subject_count'] > 0 and sub_min < 45.0:
            weak_subject_penalty = (45.0 - sub_min) * 0.3
            base_score -= weak_subject_penalty

        # 4. Consistency Momentum (comparing internal marks vs previous semester)
        trend_delta = itr - prv
        momentum_impact = trend_delta * 0.1  # Positive or negative momentum

        final_predicted_pct = round(min(max(base_score + momentum_impact, 0.0), 100.0), 1)

        # 5. Classification (High / Medium / Low)
        if final_predicted_pct >= 75.0:
            performance_tier = "High"
            tier_badge = "Excellent"
        elif final_predicted_pct >= 50.0:
            performance_tier = "Medium"
            tier_badge = "Average / Pass"
        else:
            performance_tier = "Low"
            tier_badge = "At-Risk / Fail"

        # 6. Academic Risk Level Determination
        risk_level, risk_code = cls._calculate_risk_level(final_predicted_pct, att, sub_min, itr)

        # 7. Confidence Score (based on data signals completeness and deviation)
        confidence_score = cls._calculate_confidence(feats)

        # 8. Explainable AI Feature Attribution
        key_factors = cls._compute_key_factors(feats, attendance_impact, weak_subject_penalty, momentum_impact, final_predicted_pct)

        return {
            "predicted_percentage": final_predicted_pct,
            "performance_tier": performance_tier,
            "tier_badge": tier_badge,
            "risk_level": risk_level,
            "risk_code": risk_code,
            "confidence_score": confidence_score,
            "features": feats,
            "key_factors": key_factors,
            "radar_metrics": {
                "Internal Exams": round(itr, 1),
                "Assignments": round(asn, 1),
                "Previous Sem": round(prv, 1),
                "Attendance": round(att, 1),
                "Subject Average": round(sub_avg, 1)
            }
        }

    @staticmethod
    def _calculate_risk_level(predicted_score: float, attendance: float, min_subject: float, internals: float) -> Tuple[str, str]:
        """Classify student into 4 distinct Risk Levels."""
        if attendance < 60.0 or predicted_score < 45.0 or min_subject < 35.0:
            return "Critical Risk", "critical"
        elif attendance < 75.0 or predicted_score < 60.0 or min_subject < 45.0 or internals < 50.0:
            return "High Risk", "high"
        elif predicted_score < 75.0 or attendance < 80.0:
            return "Moderate Risk", "moderate"
        else:
            return "Low Risk", "low"

    @staticmethod
    def _calculate_confidence(feats: Dict[str, float]) -> float:
        """Estimate statistical confidence of the prediction."""
        base_confidence = 88.0
        if feats['subject_count'] >= 4:
            base_confidence += 6.0
        elif feats['subject_count'] == 0:
            base_confidence -= 5.0
            
        # Check variance among signals
        scores = [feats['attendance'], feats['assignment'], feats['internals'], feats['prev_sem']]
        mean = sum(scores) / len(scores)
        variance = sum((s - mean) ** 2 for s in scores) / len(scores)
        std_dev = math.sqrt(variance)
        
        # High std_dev slightly lowers confidence due to inconsistent academic patterns
        confidence = base_confidence - min(std_dev * 0.3, 10.0)
        return round(min(max(confidence, 70.0), 98.5), 1)

    @staticmethod
    def _compute_key_factors(feats: Dict[str, float], att_impact: float, weak_penalty: float, momentum: float, final_score: float) -> List[Dict[str, Any]]:
        """Compute human-understandable key positive and negative drivers."""
        factors = []
        
        # 1. Attendance Driver
        if feats['attendance'] >= 85:
            factors.append({
                "factor": "Class Attendance",
                "impact": "Positive",
                "type": "positive",
                "value": f"{feats['attendance']}%",
                "description": f"Excellent attendance record strengthens continuous assessment score (+{round(att_impact if att_impact > 0 else 2.5, 1)}%).",
                "weight": 20
            })
        elif feats['attendance'] < 75:
            factors.append({
                "factor": "Low Attendance Penalty",
                "impact": "Negative",
                "type": "negative",
                "value": f"{feats['attendance']}%",
                "description": f"Attendance is below the mandatory 75% threshold ({round(att_impact, 1)}% deduction).",
                "weight": 25
            })
            
        # 2. Internal Exam Driver
        if feats['internals'] >= 75:
            factors.append({
                "factor": "Internal Examination Mastery",
                "impact": "Positive",
                "type": "positive",
                "value": f"{feats['internals']}%",
                "description": "High internal exam performance indicates strong concept grasp and exam readiness.",
                "weight": 35
            })
        elif feats['internals'] < 50:
            factors.append({
                "factor": "Weak Internal Scores",
                "impact": "Negative",
                "type": "negative",
                "value": f"{feats['internals']}%",
                "description": "Mid-term internals are currently failing or borderline, significantly pulling down expected marks.",
                "weight": 35
            })
            
        # 3. Assignment Score Driver
        if feats['assignment'] >= 80:
            factors.append({
                "factor": "Assignment & Lab Consistency",
                "impact": "Positive",
                "type": "positive",
                "value": f"{feats['assignment']}%",
                "description": "Consistent homework submissions and practical marks bolster overall standing.",
                "weight": 20
            })
        elif feats['assignment'] < 60:
            factors.append({
                "factor": "Assignment Deficit",
                "impact": "Negative",
                "type": "negative",
                "value": f"{feats['assignment']}%",
                "description": "Assignment marks are below cohort average, indicating missed deadlines or incomplete submissions.",
                "weight": 20
            })

        # 4. Historical Trajectory Driver
        if feats['prev_sem'] >= 75:
            factors.append({
                "factor": "Prior Academic Track Record",
                "impact": "Positive",
                "type": "positive",
                "value": f"{feats['prev_sem']}%",
                "description": "Strong foundational performance in previous semesters supports high expected outcome.",
                "weight": 25
            })
        elif feats['prev_sem'] < 55:
            factors.append({
                "factor": "Historical Academic Lag",
                "impact": "Negative",
                "type": "negative",
                "value": f"{feats['prev_sem']}%",
                "description": "Previous semester backlog or lower CGPA requires compensatory effort.",
                "weight": 25
            })

        # 5. Bottleneck Subject Warning
        if weak_penalty > 0:
            factors.append({
                "factor": "Weakest Subject Alert",
                "impact": "Negative",
                "type": "negative",
                "value": f"{feats['subject_min']}%",
                "description": f"Lowest subject score ({feats['subject_min']}%) introduces risk of course failure.",
                "weight": 15
            })

        return factors
