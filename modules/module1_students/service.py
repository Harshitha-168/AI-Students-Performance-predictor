import json
from typing import List, Dict, Any, Optional
from core.db import get_db

class StudentService:
    @staticmethod
    def get_all_students(search: str = "", department: str = "", year: str = "", semester: str = "") -> List[Dict[str, Any]]:
        """Retrieve students with optional filtering and latest academic record summary."""
        with get_db() as conn:
            cursor = conn.cursor()
            query = """
                SELECT s.*, 
                       (SELECT COUNT(*) FROM academic_records WHERE student_id = s.id) AS total_records,
                       (SELECT attendance_pct FROM academic_records WHERE student_id = s.id ORDER BY semester DESC LIMIT 1) AS latest_attendance,
                       (SELECT calculated_avg FROM academic_records WHERE student_id = s.id ORDER BY semester DESC LIMIT 1) AS latest_score
                FROM students s
                WHERE 1=1
            """
            params = []
            
            if search:
                query += " AND (s.full_name LIKE ? OR s.register_number LIKE ? OR s.email LIKE ?)"
                search_param = f"%{search.strip()}%"
                params.extend([search_param, search_param, search_param])
            
            if department and department != "all":
                query += " AND s.department = ?"
                params.append(department)
                
            if year and year != "all":
                query += " AND s.year = ?"
                params.append(int(year))
                
            if semester and semester != "all":
                query += " AND s.semester = ?"
                params.append(int(semester))

            query += " ORDER BY s.register_number ASC"
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    @staticmethod
    def get_student_by_id(student_id: int) -> Optional[Dict[str, Any]]:
        """Fetch student details and their academic records."""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
            student = cursor.fetchone()
            if not student:
                return None
            
            student_dict = dict(student)
            
            # Fetch associated academic records
            cursor.execute("""
                SELECT * FROM academic_records 
                WHERE student_id = ? 
                ORDER BY semester ASC
            """, (student_id,))
            records = cursor.fetchall()
            
            formatted_records = []
            for r in records:
                rd = dict(r)
                try:
                    rd['subject_marks'] = json.loads(rd['subject_marks_json'])
                except Exception:
                    rd['subject_marks'] = []
                formatted_records.append(rd)
                
            student_dict['academic_records'] = formatted_records
            return student_dict

    @staticmethod
    def get_student_by_regno(register_number: str) -> Optional[Dict[str, Any]]:
        """Fetch student by registration number."""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM students WHERE register_number = ?", (register_number.strip().upper(),))
            student = cursor.fetchone()
            if not student:
                return None
            return dict(student)

    @staticmethod
    def create_student(data: Dict[str, Any]) -> int:
        """Create a new student entry."""
        register_number = data.get('register_number', '').strip().upper()
        full_name = data.get('full_name', '').strip()
        email = data.get('email', '').strip().lower()
        department = data.get('department', 'Computer Science').strip()
        year = int(data.get('year', 1))
        semester = int(data.get('semester', 1))
        contact_number = data.get('contact_number', '').strip()
        user_id = data.get('user_id')

        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO students (user_id, register_number, full_name, email, department, year, semester, contact_number)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (user_id, register_number, full_name, email, department, year, semester, contact_number))
            return cursor.lastrowid

    @staticmethod
    def update_student(student_id: int, data: Dict[str, Any]) -> bool:
        """Update existing student."""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE students
                SET full_name = ?, department = ?, year = ?, semester = ?, contact_number = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (
                data.get('full_name', '').strip(),
                data.get('department', '').strip(),
                int(data.get('year', 1)),
                int(data.get('semester', 1)),
                data.get('contact_number', '').strip(),
                student_id
            ))
            return cursor.rowcount > 0

    @staticmethod
    def delete_student(student_id: int) -> bool:
        """Delete student and all associated records."""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM students WHERE id = ?", (student_id,))
            return cursor.rowcount > 0


class AcademicRecordService:
    @staticmethod
    def calculate_average(subject_marks: List[Dict[str, Any]]) -> float:
        """Calculate aggregate average percentage across subjects."""
        if not subject_marks:
            return 0.0
        total_obtained = sum(float(s.get('marks_obtained', 0)) for s in subject_marks)
        total_max = sum(float(s.get('max_marks', 100)) for s in subject_marks)
        if total_max <= 0:
            return 0.0
        return round((total_obtained / total_max) * 100, 2)

    @staticmethod
    def create_or_update_record(data: Dict[str, Any]) -> int:
        """Create or update an academic record for a student semester."""
        student_id = int(data.get('student_id'))
        register_number = data.get('register_number', '').strip().upper()
        department = data.get('department', 'Computer Science')
        year = int(data.get('year', 1))
        semester = int(data.get('semester', 1))
        attendance_pct = float(data.get('attendance_pct', 85.0))
        assignment_score = float(data.get('assignment_score', 80.0))
        internal_score = float(data.get('internal_score', 75.0))
        previous_sem_score = float(data.get('previous_sem_score', 70.0))
        notes = data.get('notes', '')
        
        subject_marks = data.get('subject_marks', [])
        if isinstance(subject_marks, str):
            try:
                subject_marks = json.loads(subject_marks)
            except Exception:
                subject_marks = []
                
        calculated_avg = AcademicRecordService.calculate_average(subject_marks)
        # If no subject marks provided, calculate from internal and assignments
        if not subject_marks:
            calculated_avg = round((internal_score * 0.5) + (assignment_score * 0.3) + (previous_sem_score * 0.2), 2)
            
        subject_marks_json = json.dumps(subject_marks)

        with get_db() as conn:
            cursor = conn.cursor()
            
            # Check if record for this student + semester exists
            cursor.execute("SELECT id FROM academic_records WHERE student_id = ? AND semester = ?", (student_id, semester))
            existing = cursor.fetchone()
            
            if existing:
                record_id = existing['id']
                cursor.execute("""
                    UPDATE academic_records
                    SET register_number = ?, department = ?, year = ?, attendance_pct = ?,
                        assignment_score = ?, internal_score = ?, previous_sem_score = ?,
                        subject_marks_json = ?, calculated_avg = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                """, (register_number, department, year, attendance_pct, assignment_score, internal_score, 
                      previous_sem_score, subject_marks_json, calculated_avg, notes, record_id))
                return record_id
            else:
                cursor.execute("""
                    INSERT INTO academic_records 
                    (student_id, register_number, department, year, semester, attendance_pct,
                     assignment_score, internal_score, previous_sem_score, subject_marks_json, calculated_avg, notes)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (student_id, register_number, department, year, semester, attendance_pct,
                      assignment_score, internal_score, previous_sem_score, subject_marks_json, calculated_avg, notes))
                return cursor.lastrowid

    @staticmethod
    def get_record_by_id(record_id: int) -> Optional[Dict[str, Any]]:
        """Fetch single academic record with parsed subject marks."""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT ar.*, s.full_name, s.email 
                FROM academic_records ar
                JOIN students s ON s.id = ar.student_id
                WHERE ar.id = ?
            """, (record_id,))
            record = cursor.fetchone()
            if not record:
                return None
            record_dict = dict(record)
            try:
                record_dict['subject_marks'] = json.loads(record_dict['subject_marks_json'])
            except Exception:
                record_dict['subject_marks'] = []
            return record_dict

    @staticmethod
    def delete_record(record_id: int) -> bool:
        """Delete single academic record."""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM academic_records WHERE id = ?", (record_id,))
            return cursor.rowcount > 0

    @staticmethod
    def get_overall_stats() -> Dict[str, Any]:
        """Aggregate statistical metrics for Faculty/Admin overview."""
        with get_db() as conn:
            cursor = conn.cursor()
            
            cursor.execute("SELECT COUNT(*) AS total_students FROM students")
            total_students = cursor.fetchone()['total_students']
            
            cursor.execute("SELECT COUNT(*) AS total_records, AVG(attendance_pct) AS avg_attendance, AVG(calculated_avg) AS avg_score FROM academic_records")
            rec_stats = cursor.fetchone()
            
            cursor.execute("""
                SELECT department, COUNT(*) as count 
                FROM students 
                GROUP BY department
            """)
            dept_stats = [dict(r) for r in cursor.fetchall()]
            
            return {
                "total_students": total_students,
                "total_records": rec_stats['total_records'] or 0,
                "avg_attendance": round(rec_stats['avg_attendance'] or 0, 1),
                "avg_score": round(rec_stats['avg_score'] or 0, 1),
                "department_distribution": dept_stats
            }
