import json
from core.db import get_db, init_db
from core.auth import hash_password
from modules.module1_students.service import StudentService, AcademicRecordService
from modules.module2_prediction.service import PredictionService

def seed_database():
    """Populate database with initial schema and rich sample data."""
    print("Initializing database tables...")
    init_db()
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as count FROM users")
        if cursor.fetchone()['count'] > 0:
            print("Database already contains data. Skipping default seeding.")
            return

    print("Seeding demo accounts and student records...")
    
    # 1. Create Faculty/Admin Account
    admin_pass = hash_password("admin123")
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (email, password_hash, full_name, role, department)
            VALUES ('faculty@edu.ai', ?, 'Dr. Marcus Vance (Dean)', 'faculty', 'Computer Science')
        """, (admin_pass,))

    # 2. Sample Students Data
    sample_students = [
        {
            "email": "alex.cs@edu.ai",
            "full_name": "Alex Rivera",
            "register_number": "2024CS101",
            "department": "Computer Science",
            "year": 3,
            "semester": 5,
            "contact_number": "+1 (555) 234-8901",
            "records": [
                {
                    "semester": 4,
                    "attendance_pct": 92.0,
                    "assignment_score": 90.0,
                    "internal_score": 86.0,
                    "previous_sem_score": 88.0,
                    "notes": "Consistently strong academic performance",
                    "subject_marks": [
                        {"subject_name": "Operating Systems", "marks_obtained": 90, "max_marks": 100},
                        {"subject_name": "Database Management", "marks_obtained": 88, "max_marks": 100},
                        {"subject_name": "Design & Analysis of Algorithms", "marks_obtained": 87, "max_marks": 100},
                        {"subject_name": "Theory of Computation", "marks_obtained": 85, "max_marks": 100}
                    ]
                },
                {
                    "semester": 5,
                    "attendance_pct": 95.0,
                    "assignment_score": 94.0,
                    "internal_score": 90.0,
                    "previous_sem_score": 87.5,
                    "notes": "Dean's list honors candidate",
                    "subject_marks": [
                        {"subject_name": "Artificial Intelligence", "marks_obtained": 94, "max_marks": 100},
                        {"subject_name": "Cloud Computing", "marks_obtained": 91, "max_marks": 100},
                        {"subject_name": "Compiler Design", "marks_obtained": 89, "max_marks": 100},
                        {"subject_name": "Computer Networks", "marks_obtained": 92, "max_marks": 100}
                    ]
                }
            ]
        },
        {
            "email": "priya.it@edu.ai",
            "full_name": "Priya Sharma",
            "register_number": "2024IT204",
            "department": "Information Technology",
            "year": 2,
            "semester": 3,
            "contact_number": "+1 (555) 456-7890",
            "records": [
                {
                    "semester": 3,
                    "attendance_pct": 79.0,
                    "assignment_score": 74.0,
                    "internal_score": 68.0,
                    "previous_sem_score": 72.0,
                    "notes": "Good in web development, needs practice in algorithms",
                    "subject_marks": [
                        {"subject_name": "Data Structures & OOP", "marks_obtained": 66, "max_marks": 100},
                        {"subject_name": "Web Technology", "marks_obtained": 78, "max_marks": 100},
                        {"subject_name": "Discrete Mathematics", "marks_obtained": 62, "max_marks": 100},
                        {"subject_name": "Software Engineering", "marks_obtained": 73, "max_marks": 100}
                    ]
                }
            ]
        },
        {
            "email": "rahul.me@edu.ai",
            "full_name": "Rahul Verma",
            "register_number": "2024ME312",
            "department": "Mechanical Engineering",
            "year": 3,
            "semester": 6,
            "contact_number": "+1 (555) 789-0123",
            "records": [
                {
                    "semester": 6,
                    "attendance_pct": 68.0,
                    "assignment_score": 60.0,
                    "internal_score": 54.0,
                    "previous_sem_score": 58.0,
                    "notes": "Attendance below 75% threshold; requires special advising",
                    "subject_marks": [
                        {"subject_name": "Thermodynamics II", "marks_obtained": 52, "max_marks": 100},
                        {"subject_name": "Fluid Mechanics & Machinery", "marks_obtained": 48, "max_marks": 100},
                        {"subject_name": "Kinematics of Machinery", "marks_obtained": 55, "max_marks": 100},
                        {"subject_name": "Manufacturing Technology", "marks_obtained": 61, "max_marks": 100}
                    ]
                }
            ]
        },
        {
            "email": "sara.ec@edu.ai",
            "full_name": "Sara Jenkins",
            "register_number": "2024EC405",
            "department": "Electronics & Communication",
            "year": 4,
            "semester": 7,
            "contact_number": "+1 (555) 890-1234",
            "records": [
                {
                    "semester": 7,
                    "attendance_pct": 54.0,
                    "assignment_score": 45.0,
                    "internal_score": 40.0,
                    "previous_sem_score": 48.0,
                    "notes": "Critical risk of exam detention due to attendance shortage",
                    "subject_marks": [
                        {"subject_name": "VLSI Design", "marks_obtained": 42, "max_marks": 100},
                        {"subject_name": "Digital Signal Processing", "marks_obtained": 35, "max_marks": 100},
                        {"subject_name": "Microwave Engineering", "marks_obtained": 38, "max_marks": 100},
                        {"subject_name": "Wireless Communication", "marks_obtained": 44, "max_marks": 100}
                    ]
                }
            ]
        },
        {
            "email": "david.cs@edu.ai",
            "full_name": "David Chen",
            "register_number": "2024CS108",
            "department": "Computer Science",
            "year": 2,
            "semester": 4,
            "contact_number": "+1 (555) 901-2345",
            "records": [
                {
                    "semester": 4,
                    "attendance_pct": 88.0,
                    "assignment_score": 86.0,
                    "internal_score": 82.0,
                    "previous_sem_score": 80.0,
                    "notes": "High engagement in machine learning project",
                    "subject_marks": [
                        {"subject_name": "Data Mining", "marks_obtained": 84, "max_marks": 100},
                        {"subject_name": "Computer Architecture", "marks_obtained": 79, "max_marks": 100},
                        {"subject_name": "Applied Statistics", "marks_obtained": 86, "max_marks": 100},
                        {"subject_name": "Java & Distributed Systems", "marks_obtained": 83, "max_marks": 100}
                    ]
                }
            ]
        }
    ]

    student_pass = hash_password("student123")
    for s in sample_students:
        user_id = None
        student_id = None
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO users (email, password_hash, full_name, role, register_number, department)
                VALUES (?, ?, ?, 'student', ?, ?)
            """, (s['email'], student_pass, s['full_name'], s['register_number'], s['department']))
            user_id = cursor.lastrowid
            
            cursor.execute("""
                INSERT INTO students (user_id, register_number, full_name, email, department, year, semester, contact_number)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (user_id, s['register_number'], s['full_name'], s['email'], s['department'], s['year'], s['semester'], s['contact_number']))
            student_id = cursor.lastrowid

        # Create academic records
        for rec in s['records']:
            rec_data = {
                'student_id': student_id,
                'register_number': s['register_number'],
                'department': s['department'],
                'year': s['year'],
                'semester': rec['semester'],
                'attendance_pct': rec['attendance_pct'],
                'assignment_score': rec['assignment_score'],
                'internal_score': rec['internal_score'],
                'previous_sem_score': rec['previous_sem_score'],
                'notes': rec['notes'],
                'subject_marks': rec['subject_marks']
            }
            AcademicRecordService.create_or_update_record(rec_data)

    # Pre-generate predictions for all seeded students
    print("Computing initial AI predictions...")
    all_students = StudentService.get_all_students()
    for st in all_students:
        PredictionService.predict_for_student(st['id'])

    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed_database()
