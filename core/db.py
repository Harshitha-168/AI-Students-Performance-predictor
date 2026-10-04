import sqlite3
import json
import os
from contextlib import contextmanager
from config import Config

def get_db_connection():
    """Returns a new database connection with row factory configured."""
    conn = sqlite3.connect(Config.DATABASE_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

@contextmanager
def get_db():
    """Context manager for safe database transactions."""
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    """Initialize database tables with constraints and indexes."""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 1. Users table (for authentication: students and faculty/admin)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
            register_number TEXT,
            department TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # 2. Students profile table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            register_number TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            department TEXT NOT NULL,
            year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 5),
            semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 10),
            contact_number TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );
        """)

        # 3. Academic Records table (Module 1 data store)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS academic_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            register_number TEXT NOT NULL,
            department TEXT NOT NULL,
            year INTEGER NOT NULL,
            semester INTEGER NOT NULL,
            attendance_pct REAL NOT NULL CHECK (attendance_pct BETWEEN 0 AND 100),
            assignment_score REAL NOT NULL CHECK (assignment_score BETWEEN 0 AND 100),
            internal_score REAL NOT NULL CHECK (internal_score BETWEEN 0 AND 100),
            previous_sem_score REAL NOT NULL CHECK (previous_sem_score BETWEEN 0 AND 100),
            subject_marks_json TEXT NOT NULL,
            calculated_avg REAL NOT NULL,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
            UNIQUE(student_id, semester)
        );
        """)

        # 4. Predictions Log table (Module 2 audit & tracking)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            academic_record_id INTEGER,
            predicted_percentage REAL NOT NULL,
            performance_tier TEXT NOT NULL CHECK (performance_tier IN ('High', 'Medium', 'Low')),
            risk_level TEXT NOT NULL CHECK (risk_level IN ('Low Risk', 'Moderate Risk', 'High Risk', 'Critical Risk')),
            confidence_score REAL NOT NULL,
            key_factors_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (academic_record_id) REFERENCES academic_records(id) ON DELETE CASCADE
        );
        """)

        # Indexes for fast lookup and search operations
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_students_regno ON students(register_number);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_students_dept ON students(department);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_records_student ON academic_records(student_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_records_regno ON academic_records(register_number);")
