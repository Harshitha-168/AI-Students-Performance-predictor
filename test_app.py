import unittest
import json
from app import create_app

class TestStudentPerformanceApp(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()

    def login(self, email, password):
        return self.client.post('/api/auth/login', 
                                json={'email': email, 'password': password})

    def test_01_health_check(self):
        res = self.client.get('/health')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['status'], 'healthy')
        self.assertEqual(data['modules']['module1_student_management'], 'Active')
        self.assertEqual(data['modules']['module2_ai_prediction'], 'Active')
        self.assertEqual(data['modules']['module3_suggestions'], 'Active')
        self.assertEqual(data['modules']['module4_reports'], 'Active')

    def test_02_faculty_login_and_stats(self):
        res = self.login('faculty@edu.ai', 'admin123')
        self.assertEqual(res.status_code, 200)
        
        # Test Module 1 stats
        res_stats = self.client.get('/api/stats')
        self.assertEqual(res_stats.status_code, 200)
        stats = res_stats.get_json()['stats']
        self.assertGreaterEqual(stats['total_students'], 5)

    def test_03_student_search_and_filter(self):
        self.login('faculty@edu.ai', 'admin123')
        res = self.client.get('/api/students?search=Alex')
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(len(data['students']), 1)
        self.assertEqual(data['students'][0]['register_number'], '2024CS101')

    def test_04_academic_record_crud_and_prediction(self):
        self.login('faculty@edu.ai', 'admin123')
        
        # 1. Create a test student
        new_student = {
            "register_number": "2024TEST01",
            "full_name": "Integration Tester",
            "email": "tester.cs@edu.ai",
            "department": "Computer Science",
            "year": 2,
            "semester": 4,
            "contact_number": "+1 555-9988"
        }
        res_create = self.client.post('/api/students', json=new_student)
        self.assertEqual(res_create.status_code, 201)
        student_id = res_create.get_json()['student_id']

        # 2. Add an academic record with weak subject
        record_payload = {
            "student_id": student_id,
            "register_number": "2024TEST01",
            "department": "Computer Science",
            "year": 2,
            "semester": 4,
            "attendance_pct": 65.0, # Below 75%
            "assignment_score": 58.0,
            "internal_score": 50.0,
            "previous_sem_score": 62.0,
            "notes": "Attendance deficit in mid-semester",
            "subject_marks": [
                {"subject_name": "Theory of Computation", "marks_obtained": 44, "max_marks": 100}, # Weak subject (<50)
                {"subject_name": "Database Systems", "marks_obtained": 72, "max_marks": 100}
            ]
        }
        res_rec = self.client.post('/api/academic-records', json=record_payload)
        self.assertEqual(res_rec.status_code, 200)

        # 3. Test Module 2 Prediction
        res_pred = self.client.get(f'/api/predict/student/{student_id}')
        self.assertEqual(res_pred.status_code, 200)
        pred_data = res_pred.get_json()['prediction']
        self.assertIn(pred_data['risk_level'], ['High Risk', 'Critical Risk'])

        # 4. Test Module 3 Personalized Improvement Suggestions
        res_sug = self.client.get(f'/api/suggestions/student/{student_id}')
        self.assertEqual(res_sug.status_code, 200)
        sug_data = res_sug.get_json()['suggestions']
        self.assertGreater(sug_data['critical_priority_count'], 0)
        self.assertIsNotNone(sug_data['attendance_recovery'])
        self.assertGreater(sug_data['attendance_recovery']['classes_to_attend'], 0)
        self.assertEqual(len(sug_data['weak_subjects']), 1)
        self.assertEqual(sug_data['weak_subjects'][0]['subject'], 'Theory of Computation')

        # 5. Clean up test student
        res_del = self.client.delete(f'/api/students/{student_id}')
        self.assertEqual(res_del.status_code, 200)

    def test_05_module3_cohort_summary(self):
        self.login('faculty@edu.ai', 'admin123')
        res = self.client.get('/api/suggestions/cohort-summary')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertIn('critical_priority_students', data['summary'])
        self.assertIn('attendance_detention_risk_students', data['summary'])

    def test_06_module4_analytics_and_reports(self):
        self.login('faculty@edu.ai', 'admin123')
        
        # Test Analytics endpoint
        res_ana = self.client.get('/api/reports/analytics')
        self.assertEqual(res_ana.status_code, 200)
        ana = res_ana.get_json()['analytics']
        self.assertIn('summary', ana)
        self.assertIn('attendance_vs_marks', ana)
        self.assertIn('semester_progression', ana)
        self.assertIn('subject_averages', ana)
        self.assertIn('risk_distribution', ana)

        # Test CSV Export
        res_csv = self.client.get('/api/reports/export-csv')
        self.assertEqual(res_csv.status_code, 200)
        self.assertEqual(res_csv.content_type, 'text/csv; charset=utf-8')
        csv_text = res_csv.get_data(as_text=True)
        self.assertIn("Register Number", csv_text)
        self.assertIn("2024CS101", csv_text)

        # Test Transcript Generation for seeded student 1
        res_trans = self.client.get('/api/reports/transcript/1')
        self.assertEqual(res_trans.status_code, 200)
        trans = res_trans.get_json()['transcript']
        self.assertEqual(trans['student']['register_number'], '2024CS101')
        self.assertIn('prediction', trans)
        self.assertIn('suggestions', trans)

if __name__ == '__main__':
    unittest.main()
