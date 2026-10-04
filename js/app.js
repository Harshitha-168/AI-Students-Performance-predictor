/**
 * AI Student Performance Predictor - Standalone Client Engine
 * Role-Based Access Control: Admin, Faculty, and Student.
 * 100% Offline & LocalStorage Powered.
 */

// Initial Seed Users (Stored in localStorage on first run)
const DEFAULT_USERS = [
  {
    email: "admin@edu.ai",
    password: "admin123",
    full_name: "Dr. Marcus Vance (Admin)",
    role: "admin",
    department: "Administration"
  },
  {
    email: "faculty@edu.ai",
    password: "faculty123",
    full_name: "Prof. Sarah Mitchell",
    role: "faculty",
    department: "Computer Science",
    assigned_department: "Computer Science",
    assigned_year: "All Years",
    assigned_section: "All Sections"
  },
  {
    email: "prof.it@edu.ai",
    password: "faculty123",
    full_name: "Prof. Alan Walker",
    role: "faculty",
    department: "Information Technology",
    assigned_department: "Information Technology",
    assigned_year: "All Years",
    assigned_section: "All Sections"
  },
  {
    email: "student@edu.ai",
    password: "student123",
    full_name: "Alex Rivera",
    role: "student",
    department: "Computer Science",
    register_number: "2024CS101",
    student_id: 1,
    year: 3,
    semester: 5,
    section: "Section A",
    avatar: "👨‍🎓"
  },
  {
    email: "alex.cs@edu.ai",
    password: "student123",
    full_name: "Alex Rivera",
    role: "student",
    department: "Computer Science",
    register_number: "2024CS101",
    student_id: 1,
    year: 3,
    semester: 5,
    section: "Section A",
    avatar: "👨‍🎓"
  },
  {
    email: "priya.it@edu.ai",
    password: "student123",
    full_name: "Priya Sharma",
    role: "student",
    department: "Information Technology",
    register_number: "2024IT204",
    student_id: 2,
    year: 2,
    semester: 3,
    section: "Section B",
    avatar: "👩‍🎓"
  },
  {
    email: "rahul.me@edu.ai",
    password: "student123",
    full_name: "Rahul Verma",
    role: "student",
    department: "Mechanical Engineering",
    register_number: "2024ME312",
    student_id: 3,
    year: 3,
    semester: 6,
    section: "Section A",
    avatar: "🧑‍🔧"
  },
  {
    email: "sara.ec@edu.ai",
    password: "student123",
    full_name: "Sara Jenkins",
    role: "student",
    department: "Electronics & Communication",
    register_number: "2024EC405",
    student_id: 4,
    year: 4,
    semester: 7,
    section: "Section A",
    avatar: "👩‍🔬"
  },
  {
    email: "david.cs@edu.ai",
    password: "student123",
    full_name: "David Chen",
    role: "student",
    department: "Computer Science",
    register_number: "2024CS108",
    student_id: 5,
    year: 2,
    semester: 4,
    section: "Section B",
    avatar: "🧑‍💻"
  }
];

// Initial Seed Students (Saved to localStorage on first run)
const DEFAULT_STUDENTS = [
  {
    id: 1,
    register_number: "2024CS101",
    full_name: "Alex Rivera",
    email: "alex.cs@edu.ai",
    department: "Computer Science",
    year: 3,
    semester: 5,
    section: "Section A",
    avatar: "👨‍🎓",
    contact_number: "+1 (555) 234-8901",
    academic_records: [
      {
        id: 101,
        semester: 4,
        attendance_pct: 92.0,
        assignment_score: 90.0,
        internal_score: 86.0,
        previous_sem_score: 88.0,
        notes: "Consistently strong academic performance",
        subject_marks: [
          { subject_name: "Operating Systems", marks_obtained: 90, max_marks: 100 },
          { subject_name: "Database Management", marks_obtained: 88, max_marks: 100 },
          { subject_name: "Algorithms & Logic", marks_obtained: 87, max_marks: 100 },
          { subject_name: "Theory of Computation", marks_obtained: 85, max_marks: 100 }
        ]
      },
      {
        id: 102,
        semester: 5,
        attendance_pct: 95.0,
        assignment_score: 94.0,
        internal_score: 90.0,
        previous_sem_score: 87.5,
        notes: "Dean's list honors candidate",
        subject_marks: [
          { subject_name: "Artificial Intelligence", marks_obtained: 94, max_marks: 100 },
          { subject_name: "Cloud Computing", marks_obtained: 91, max_marks: 100 },
          { subject_name: "Compiler Design", marks_obtained: 89, max_marks: 100 },
          { subject_name: "Computer Networks", marks_obtained: 92, max_marks: 100 }
        ]
      }
    ]
  },
  {
    id: 2,
    register_number: "2024IT204",
    full_name: "Priya Sharma",
    email: "priya.it@edu.ai",
    department: "Information Technology",
    year: 2,
    semester: 3,
    section: "Section B",
    avatar: "👩‍🎓",
    contact_number: "+1 (555) 456-7890",
    academic_records: [
      {
        id: 103,
        semester: 3,
        attendance_pct: 79.0,
        assignment_score: 74.0,
        internal_score: 68.0,
        previous_sem_score: 72.0,
        notes: "Good in web development, needs practice in algorithms",
        subject_marks: [
          { subject_name: "Data Structures & OOP", marks_obtained: 66, max_marks: 100 },
          { subject_name: "Web Technology", marks_obtained: 78, max_marks: 100 },
          { subject_name: "Discrete Mathematics", marks_obtained: 62, max_marks: 100 },
          { subject_name: "Software Engineering", marks_obtained: 73, max_marks: 100 }
        ]
      }
    ]
  },
  {
    id: 3,
    register_number: "2024ME312",
    full_name: "Rahul Verma",
    email: "rahul.me@edu.ai",
    department: "Mechanical Engineering",
    year: 3,
    semester: 6,
    section: "Section A",
    avatar: "🧑‍🔧",
    contact_number: "+1 (555) 789-0123",
    academic_records: [
      {
        id: 104,
        semester: 6,
        attendance_pct: 68.0,
        assignment_score: 60.0,
        internal_score: 54.0,
        previous_sem_score: 58.0,
        notes: "Attendance below 75% threshold; requires special advising",
        subject_marks: [
          { subject_name: "Thermodynamics II", marks_obtained: 52, max_marks: 100 },
          { subject_name: "Fluid Mechanics", marks_obtained: 48, max_marks: 100 },
          { subject_name: "Kinematics", marks_obtained: 55, max_marks: 100 },
          { subject_name: "Manufacturing Tech", marks_obtained: 61, max_marks: 100 }
        ]
      }
    ]
  },
  {
    id: 4,
    register_number: "2024EC405",
    full_name: "Sara Jenkins",
    email: "sara.ec@edu.ai",
    department: "Electronics & Communication",
    year: 4,
    semester: 7,
    section: "Section A",
    avatar: "👩‍🔬",
    contact_number: "+1 (555) 890-1234",
    academic_records: [
      {
        id: 105,
        semester: 7,
        attendance_pct: 54.0,
        assignment_score: 45.0,
        internal_score: 40.0,
        previous_sem_score: 48.0,
        notes: "Critical risk of exam detention due to attendance shortage",
        subject_marks: [
          { subject_name: "VLSI Design", marks_obtained: 42, max_marks: 100 },
          { subject_name: "Digital Signal Processing", marks_obtained: 35, max_marks: 100 },
          { subject_name: "Microwave Engineering", marks_obtained: 38, max_marks: 100 },
          { subject_name: "Wireless Communication", marks_obtained: 44, max_marks: 100 }
        ]
      }
    ]
  },
  {
    id: 5,
    register_number: "2024CS108",
    full_name: "David Chen",
    email: "david.cs@edu.ai",
    department: "Computer Science",
    year: 2,
    semester: 4,
    section: "Section B",
    avatar: "🧑‍💻",
    contact_number: "+1 (555) 901-2345",
    academic_records: [
      {
        id: 106,
        semester: 4,
        attendance_pct: 88.0,
        assignment_score: 86.0,
        internal_score: 82.0,
        previous_sem_score: 80.0,
        notes: "High engagement in machine learning project",
        subject_marks: [
          { subject_name: "Data Mining", marks_obtained: 84, max_marks: 100 },
          { subject_name: "Computer Architecture", marks_obtained: 79, max_marks: 100 },
          { subject_name: "Applied Statistics", marks_obtained: 86, max_marks: 100 },
          { subject_name: "Java & Distributed Systems", marks_obtained: 83, max_marks: 100 }
        ]
      }
    ]
  },
  {
    id: 6,
    register_number: "2024CS115",
    full_name: "Maya Patel",
    email: "maya.cs@edu.ai",
    department: "Computer Science",
    year: 3,
    semester: 5,
    section: "Section A",
    avatar: "👩‍💻",
    contact_number: "+1 (555) 345-6789",
    academic_records: [
      {
        id: 107,
        semester: 5,
        attendance_pct: 84.0,
        assignment_score: 80.0,
        internal_score: 76.0,
        previous_sem_score: 78.0,
        notes: "Good analytical aptitude",
        subject_marks: [
          { subject_name: "Artificial Intelligence", marks_obtained: 82, max_marks: 100 },
          { subject_name: "Cloud Computing", marks_obtained: 78, max_marks: 100 },
          { subject_name: "Compiler Design", marks_obtained: 74, max_marks: 100 },
          { subject_name: "Computer Networks", marks_obtained: 80, max_marks: 100 }
        ]
      }
    ]
  }
];

// --- Persistent Storage Manager with Role Scoping ---
const Storage = {
  getUsers() {
    const raw = localStorage.getItem('edu_ai_users');
    if (!raw) {
      this.saveUsers(DEFAULT_USERS);
      return DEFAULT_USERS;
    }
    try {
      const parsed = JSON.parse(raw);
      // Ensure seed faculty accounts exist if older storage
      if (!parsed.some(u => u.email === "prof.it@edu.ai")) {
        this.saveUsers(DEFAULT_USERS);
        return DEFAULT_USERS;
      }
      return parsed;
    } catch {
      return DEFAULT_USERS;
    }
  },

  saveUsers(users) {
    localStorage.setItem('edu_ai_users', JSON.stringify(users));
  },

  addUser(userData) {
    const users = this.getUsers();
    users.push(userData);
    this.saveUsers(users);
  },

  getFacultyList() {
    return this.getUsers().filter(u => u.role === 'faculty');
  },

  updateUser(email, updateFields) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updateFields };
      this.saveUsers(users);
      return users[idx];
    }
    return null;
  },

  deleteFaculty(email) {
    let users = this.getUsers();
    users = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
    this.saveUsers(users);
  },

  assignFaculty(email, dept, year, section) {
    return this.updateUser(email, {
      assigned_department: dept,
      assigned_year: year || "All Years",
      assigned_section: section || "All Sections"
    });
  },

  getCurrentSession() {
    const raw = localStorage.getItem('edu_ai_active_session');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentSession(user) {
    if (user) {
      localStorage.setItem('edu_ai_active_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('edu_ai_active_session');
    }
  },

  getStudents() {
    const raw = localStorage.getItem('edu_ai_students');
    if (!raw) {
      this.saveStudents(DEFAULT_STUDENTS);
      return DEFAULT_STUDENTS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.length === 0 || !parsed[0].section) {
        this.saveStudents(DEFAULT_STUDENTS);
        return DEFAULT_STUDENTS;
      }
      return parsed;
    } catch {
      return DEFAULT_STUDENTS;
    }
  },

  saveStudents(students) {
    localStorage.setItem('edu_ai_students', JSON.stringify(students));
  },

  /**
   * Role-based Student Scoper
   * Enforces data access boundaries at the JavaScript layer
   */
  getAccessibleStudents(user) {
    if (!user) return [];
    const allStudents = this.getStudents();

    if (user.role === 'admin') {
      return allStudents; // Admin can view and manage ALL students
    }

    if (user.role === 'faculty') {
      // Faculty can view ONLY students assigned to their class/department
      const facultyDept = user.assigned_department || user.department || 'Computer Science';
      const facultyYear = user.assigned_year || 'All Years';
      const facultySec = user.assigned_section || 'All Sections';

      return allStudents.filter(s => {
        // Match Department
        if (s.department !== facultyDept) return false;

        // Match Year/Class if specified
        if (facultyYear !== 'All Years') {
          const matchYear = parseInt(facultyYear.replace(/\D/g, ''));
          if (matchYear && s.year !== matchYear) return false;
        }

        // Match Section if specified
        if (facultySec !== 'All Sections' && s.section && s.section !== facultySec) {
          return false;
        }

        return true;
      });
    }

    if (user.role === 'student') {
      // Student can view ONLY their own academic information
      return allStudents.filter(s => 
        (user.student_id && s.id === user.student_id) ||
        (user.register_number && s.register_number === user.register_number) ||
        (user.email && s.email.toLowerCase() === user.email.toLowerCase())
      );
    }

    return [];
  },

  /**
   * Safe Student Community Peer Directory
   * Strips out ALL marks, attendance, internals, predictions, and remarks
   */
  getCommunityStudents() {
    const all = this.getStudents();
    return all.map(s => ({
      id: s.id,
      full_name: s.full_name,
      avatar: s.avatar || "👨‍🎓",
      department: s.department,
      year: s.year,
      semester: s.semester,
      section: s.section || "Section A"
    }));
  },

  canAccessStudent(user, studentId) {
    if (!user) return false;
    if (user.role === 'admin') return true;
    const accessible = this.getAccessibleStudents(user);
    return accessible.some(s => s.id === Number(studentId));
  },

  canEditStudent(user, studentId) {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'faculty') {
      return this.canAccessStudent(user, studentId);
    }
    return false; // Students cannot edit academic records
  },

  getStudentById(id) {
    const students = this.getStudents();
    return students.find(s => s.id === Number(id)) || null;
  },

  saveStudent(student) {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.id === student.id);
    if (idx !== -1) {
      students[idx] = student;
    } else {
      student.id = Date.now();
      students.push(student);
    }
    this.saveStudents(students);
    return student;
  },

  deleteStudent(id) {
    let students = this.getStudents();
    students = students.filter(s => s.id !== Number(id));
    this.saveStudents(students);
  },

  addAcademicRecord(studentId, record) {
    const students = this.getStudents();
    const s = students.find(item => item.id === Number(studentId));
    if (!s) return null;

    if (!s.academic_records) s.academic_records = [];
    record.id = Date.now();
    s.academic_records.push(record);

    this.saveStudents(students);
    return s;
  }
};


// --- Supervised Machine Learning Engine (Client-Side) ---
const MLEngine = {
  WEIGHTS: {
    ATTENDANCE: 0.28,
    INTERNALS: 0.32,
    ASSIGNMENTS: 0.18,
    PREVIOUS_SEM: 0.22
  },

  predict(record) {
    const att = parseFloat(record.attendance_pct || 0);
    const itr = parseFloat(record.internal_score || 0);
    const asn = parseFloat(record.assignment_score || 0);
    const prv = parseFloat(record.previous_sem_score || 0);

    let baseScore = (
      att * this.WEIGHTS.ATTENDANCE +
      itr * this.WEIGHTS.INTERNALS +
      asn * this.WEIGHTS.ASSIGNMENTS +
      prv * this.WEIGHTS.PREVIOUS_SEM
    );

    let penalty = 0;
    if (att < 60) penalty += 8.5;
    else if (att < 75) penalty += 3.5;

    if (itr < 45) penalty += 5.0;

    let synergyBonus = 0;
    if (att >= 85 && itr >= 80 && asn >= 80) synergyBonus += 2.5;

    let finalScore = Math.max(0, Math.min(100, baseScore - penalty + synergyBonus));
    finalScore = Number(finalScore.toFixed(1));

    let tier = "Low";
    let tierCode = "low";
    if (finalScore >= 75) {
      tier = "High";
      tierCode = "high";
    } else if (finalScore >= 55) {
      tier = "Medium";
      tierCode = "medium";
    }

    let riskLevel = "Low Risk";
    let riskCode = "low";
    if (finalScore < 45 || att < 60) {
      riskLevel = "Critical Risk";
      riskCode = "critical";
    } else if (finalScore < 60 || att < 75) {
      riskLevel = "High Risk";
      riskCode = "high";
    } else if (finalScore < 72) {
      riskLevel = "Moderate Risk";
      riskCode = "moderate";
    }

    const factors = [];
    factors.push({
      factor: "Attendance Impact",
      impact: att >= 75 ? "Positive Driver" : "Risk Factor",
      impact_code: att >= 75 ? "positive" : "negative",
      description: att >= 75
        ? `Consistent attendance (${att}%) satisfies requirements and adds stability.`
        : `Attendance (${att}%) is below 75% threshold, triggering detention hazard.`
    });

    factors.push({
      factor: "Mid-Term Internals",
      impact: itr >= 65 ? "Positive Driver" : (itr < 50 ? "High Negative Impact" : "Neutral Factor"),
      impact_code: itr >= 65 ? "positive" : "negative",
      description: `Internal examination performance is ${itr}%. Weight: 32%.`
    });

    factors.push({
      factor: "Assignment & Lab Work",
      impact: asn >= 70 ? "Positive Driver" : "Room for Improvement",
      impact_code: asn >= 70 ? "positive" : "neutral",
      description: `Continuous assessment submissions are scored at ${asn}%.`
    });

    factors.push({
      factor: "Historical Baseline",
      impact: prv >= 70 ? "Positive Baseline" : "Historical Lag",
      impact_code: prv >= 70 ? "positive" : "neutral",
      description: `Previous semester GPA equivalent baseline is ${prv}%.`
    });

    return {
      predicted_percentage: finalScore,
      performance_tier: tier,
      tier_code: tierCode,
      risk_level: riskLevel,
      risk_code: riskCode,
      factors
    };
  }
};


// --- Module 3: Personalized Improvement Suggestions Engine ---
const SuggestionsEngine = {
  generate(student, record, prediction) {
    const weakSubjects = [];
    const subjects = record.subject_marks || [];

    subjects.forEach(sub => {
      const score = parseFloat(sub.marks_obtained || 0);
      const max = parseFloat(sub.max_marks || 100);
      const pct = (score / max) * 100;

      if (pct < 70) {
        let priority = "Medium";
        let priorityCode = "medium";
        let weeklyHours = 3.5;
        let action = `Focus on core theoretical fundamentals and solve 5 practice questions weekly.`;

        if (pct < 50) {
          priority = "Critical";
          priorityCode = "critical";
          weeklyHours = 7.0;
          action = `Urgent remedial attention needed. Attend faculty office hours and review fundamental textbook chapters.`;
        } else if (pct < 60) {
          priority = "High";
          priorityCode = "high";
          weeklyHours = 5.0;
          action = `Work through past exam papers and clarify doubts with course tutors.`;
        }

        weakSubjects.push({
          subject: sub.subject_name,
          current_score: pct,
          priority,
          priority_code: priorityCode,
          recommended_weekly_hours: weeklyHours,
          action_plan: action
        });
      }
    });

    const att = parseFloat(record.attendance_pct || 0);
    const asn = parseFloat(record.assignment_score || 0);
    const itr = parseFloat(record.internal_score || 0);
    const predScore = prediction.predicted_percentage;

    let attRec = null;
    let potentialGain = 0;

    if (weakSubjects.length > 0) {
      potentialGain += weakSubjects.length * 3.2;
    }

    if (att < 75) {
      const totalLecturesEstimated = 60;
      const attended = Math.round((att / 100) * totalLecturesEstimated);
      const needed = Math.max(0, Math.ceil(0.75 * (totalLecturesEstimated + 15) - attended));
      const classesNeeded = Math.min(Math.max(needed, 4), 22);

      const gain = att < 60 ? 8.5 : 4.0;
      potentialGain += gain;
      attRec = {
        title: "Mandatory Attendance Restoration Plan",
        current_attendance: att,
        target_attendance: 75.0,
        classes_to_attend: classesNeeded,
        priority: att < 60 ? "Critical" : "High",
        priority_code: att < 60 ? "critical" : "high",
        estimated_gain: `+${gain}%`,
        description: `Current attendance is ${att}%, below statutory 75%. Attend next ${classesNeeded} consecutive lectures to clear exam detention risk.`,
        action_items: [
          `Attend next ${classesNeeded} classes consecutively without absence`,
          "Submit approved medical or leave certificates immediately",
          "Participate in lab sessions to claim makeup attendance credits"
        ]
      };
    }

    const targetProjected = Math.min(Number((predScore + Math.min(potentialGain, 22.0)).toFixed(1)), 98.0);

    return {
      student,
      record,
      prediction,
      current_predicted_score: predScore,
      target_projected_score: targetProjected,
      total_potential_gain: `+${Math.min(potentialGain, 22.0).toFixed(1)}%`,
      weak_subjects: weakSubjects,
      attendance_recovery: attRec,
      critical_priority_count: (attRec && attRec.priority_code === 'critical' ? 1 : 0) + weakSubjects.filter(w => w.priority_code === 'critical').length,
      high_priority_count: (attRec && attRec.priority_code === 'high' ? 1 : 0) + weakSubjects.filter(w => w.priority_code === 'high').length,
      medium_priority_count: 1
    };
  }
};


// --- Standalone UI & Controller with Strict Role-Based Access ---
const App = {
  currentUser: null,
  activeTab: "dashboard",
  currentSelectedStudentId: 1,

  init() {
    this.bindEvents();
    this.init3DPhysics();
    this.checkAuth();
  },

  checkAuth() {
    const session = Storage.getCurrentSession();
    if (session && session.email) {
      this.currentUser = session;
      this.renderUserSession();
      this.switchTab('dashboard');
    } else {
      this.currentUser = null;
      this.showAuthView();
    }
  },

  showAuthView() {
    document.getElementById('authContainer').style.display = 'block';
    document.getElementById('appMainContainer').style.display = 'none';
    const errBox = document.getElementById('loginErrorMessage');
    if (errBox) errBox.style.display = 'none';
  },

  renderUserSession() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('appMainContainer').style.display = 'flex';

    // Sidebar User Widget
    const avatar = document.getElementById('sidebarUserAvatar');
    const name = document.getElementById('sidebarUserName');
    const roleBadge = document.getElementById('sidebarUserRole');

    if (avatar) avatar.innerText = this.currentUser.avatar || this.currentUser.full_name.charAt(0);
    if (name) name.innerText = this.currentUser.full_name;
    if (roleBadge) {
      roleBadge.innerText = this.currentUser.role;
      roleBadge.className = `user-role-badge role-${this.currentUser.role}`;
    }

    // Dynamic Navigation & Topbar Actions
    this.renderNavMenu();
    this.renderTopbarActions();
  },

  login(email, password) {
    const users = Storage.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);

    if (user) {
      // Find corresponding student record if role is student
      if (user.role === 'student' && !user.student_id) {
        const studentRec = Storage.getStudents().find(s => s.email.toLowerCase() === user.email.toLowerCase() || s.register_number === user.register_number);
        if (studentRec) {
          user.student_id = studentRec.id;
        }
      }

      Storage.setCurrentSession(user);
      this.currentUser = user;
      this.renderUserSession();

      // Explicit Login Redirection per Role
      this.switchTab('dashboard');
      this.showToast(`Signed in as ${user.full_name} (${user.role.toUpperCase()})`, 'success');
    } else {
      const errBox = document.getElementById('loginErrorMessage');
      if (errBox) {
        errBox.style.display = 'block';
        errBox.innerText = 'Invalid email or password. Please try again.';
      }
      this.showToast('Invalid login credentials', 'error');
    }
  },

  register(payload) {
    const users = Storage.getUsers();
    if (users.some(u => u.email.toLowerCase() === payload.email.toLowerCase())) {
      this.showToast('An account with this email already exists.', 'error');
      return;
    }

    let studentId = null;
    if (payload.role === 'student') {
      const newStudent = {
        id: Date.now(),
        register_number: payload.register_number || `REG${Math.floor(1000 + Math.random() * 9000)}`,
        full_name: payload.full_name,
        email: payload.email,
        department: payload.department,
        year: Number(payload.year) || 1,
        semester: Number(payload.semester) || 1,
        section: payload.section || "Section A",
        avatar: "👨‍🎓",
        contact_number: "+1 (555) 000-0000",
        academic_records: [
          {
            id: Date.now() + 1,
            semester: Number(payload.semester) || 1,
            attendance_pct: 85.0,
            assignment_score: 80.0,
            internal_score: 75.0,
            previous_sem_score: 75.0,
            notes: "Newly registered student profile",
            subject_marks: [
              { subject_name: "Core Subject 1", marks_obtained: 80, max_marks: 100 },
              { subject_name: "Core Subject 2", marks_obtained: 75, max_marks: 100 }
            ]
          }
        ]
      };
      Storage.saveStudent(newStudent);
      studentId = newStudent.id;
    }

    const newUser = {
      ...payload,
      student_id: studentId,
      assigned_department: payload.department,
      assigned_year: "All Years",
      assigned_section: "All Sections"
    };

    Storage.addUser(newUser);
    Storage.setCurrentSession(newUser);
    this.currentUser = newUser;
    this.renderUserSession();
    this.switchTab('dashboard');
    this.showToast(`Account created successfully! Welcome, ${newUser.full_name}`, 'success');
  },

  logout() {
    Storage.setCurrentSession(null);
    this.currentUser = null;
    this.showAuthView();
    this.showToast('You have been signed out.', 'info');
  },

  /**
   * Role-Based Sidebar Navigation Renderer
   */
  renderNavMenu() {
    const menu = document.getElementById('dynamicNavMenu');
    if (!menu || !this.currentUser) return;

    let html = '';

    if (this.currentUser.role === 'admin') {
      html = `
        <li class="nav-section-title">Admin Controls</li>
        <li>
          <a class="nav-item active" data-tab="dashboard">
            <span class="icon">📊</span>
            <span>Admin Dashboard</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-tab="students">
            <span class="icon">👨‍🎓</span>
            <span>All Students</span>
            <span class="nav-badge">Mod 1</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-tab="faculty-admin">
            <span class="icon">👩‍🏫</span>
            <span>Faculty & Assign</span>
            <span class="nav-badge">Admin</span>
          </a>
        </li>
        <li class="nav-section-title">AI Predictive Engine</li>
        <li>
          <a class="nav-item" data-tab="predict">
            <span class="icon">🧠</span>
            <span>AI Predictor</span>
            <span class="nav-badge">Mod 2</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-tab="suggestions">
            <span class="icon">💡</span>
            <span>AI Suggestions</span>
            <span class="nav-badge">Mod 3</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-tab="simulator">
            <span class="icon">🎛️</span>
            <span>What-If Simulator</span>
            <span class="nav-badge">AI Lab</span>
          </a>
        </li>
        <li class="nav-section-title">Institutional Reports</li>
        <li>
          <a class="nav-item" data-tab="reports">
            <span class="icon">📑</span>
            <span>Reports & Analytics</span>
            <span class="nav-badge">Mod 4</span>
          </a>
        </li>
      `;
    } else if (this.currentUser.role === 'faculty') {
      html = `
        <li class="nav-section-title">Faculty Portal</li>
        <li>
          <a class="nav-item active" data-tab="dashboard">
            <span class="icon">📊</span>
            <span>Class Dashboard</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-tab="students">
            <span class="icon">👨‍🎓</span>
            <span>Assigned Students</span>
            <span class="nav-badge">Mod 1</span>
          </a>
        </li>
        <li class="nav-section-title">AI Intelligence</li>
        <li>
          <a class="nav-item" data-tab="predict">
            <span class="icon">🧠</span>
            <span>Class AI Predictor</span>
            <span class="nav-badge">Mod 2</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-tab="suggestions">
            <span class="icon">💡</span>
            <span>AI Suggestions</span>
            <span class="nav-badge">Mod 3</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-tab="simulator">
            <span class="icon">🎛️</span>
            <span>What-If Simulator</span>
            <span class="nav-badge">AI Lab</span>
          </a>
        </li>
        <li class="nav-section-title">Class Analytics</li>
        <li>
          <a class="nav-item" data-tab="reports">
            <span class="icon">📑</span>
            <span>Class Reports</span>
            <span class="nav-badge">Mod 4</span>
          </a>
        </li>
      `;
    } else {
      // Student Role
      html = `
        <li class="nav-section-title">Student Portal</li>
        <li>
          <a class="nav-item active" data-tab="dashboard">
            <span class="icon">📊</span>
            <span>My Cockpit</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-tab="predict">
            <span class="icon">🧠</span>
            <span>My AI Prediction</span>
            <span class="nav-badge">Mod 2</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-tab="suggestions">
            <span class="icon">💡</span>
            <span>My Action Plan</span>
            <span class="nav-badge">Mod 3</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-tab="simulator">
            <span class="icon">🎛️</span>
            <span>Grade Simulator</span>
            <span class="nav-badge">AI Lab</span>
          </a>
        </li>
        <li class="nav-section-title">Records & Peer Hub</li>
        <li>
          <a class="nav-item" data-tab="reports">
            <span class="icon">📑</span>
            <span>My Transcript</span>
            <span class="nav-badge">Mod 4</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-tab="community">
            <span class="icon">🌐</span>
            <span>Student Community</span>
            <span class="nav-badge">Social</span>
          </a>
        </li>
      `;
    }

    menu.innerHTML = html;

    // Bind nav click listeners
    menu.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.getAttribute('data-tab');
        if (tab) this.switchTab(tab);
      });
    });
  },

  renderTopbarActions() {
    const container = document.getElementById('topbarActions');
    if (!container || !this.currentUser) return;

    if (this.currentUser.role === 'admin') {
      container.innerHTML = `
        <button class="btn btn-secondary btn-sm" onclick="App.openAddFacultyModal()">
          👩‍🏫 Add Faculty
        </button>
        <button class="btn btn-primary btn-sm" onclick="App.openAddStudentModal()">
          ➕ New Student
        </button>
        <button class="btn btn-danger btn-sm" onclick="App.logout()">
          🚪 Sign Out
        </button>
      `;
    } else if (this.currentUser.role === 'faculty') {
      container.innerHTML = `
        <button class="btn btn-cyan btn-sm" onclick="App.switchTab('simulator')">
          🎛️ Launch Simulator
        </button>
        <button class="btn btn-primary btn-sm" onclick="App.switchTab('students')">
          📝 Grade Students
        </button>
        <button class="btn btn-danger btn-sm" onclick="App.logout()">
          🚪 Sign Out
        </button>
      `;
    } else {
      // Student
      container.innerHTML = `
        <button class="btn btn-cyan btn-sm" onclick="App.switchTab('simulator')">
          🎛️ Simulate Grades
        </button>
        <button class="btn btn-secondary btn-sm" onclick="App.switchTab('community')">
          🌐 Peer Community
        </button>
        <button class="btn btn-danger btn-sm" onclick="App.logout()">
          🚪 Sign Out
        </button>
      `;
    }
  },

  switchTab(tabName) {
    this.activeTab = tabName;

    // Security check: Student cannot access faculty-admin tab or raw student management tab
    if (this.currentUser && this.currentUser.role === 'student') {
      if (tabName === 'faculty-admin' || tabName === 'students') {
        tabName = 'dashboard';
        this.activeTab = 'dashboard';
      }
    }
    // Faculty cannot access faculty-admin tab
    if (this.currentUser && this.currentUser.role === 'faculty' && tabName === 'faculty-admin') {
      tabName = 'dashboard';
      this.activeTab = 'dashboard';
    }

    // Update nav active classes
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Hide all view sections
    const views = document.querySelectorAll('.view-section');
    views.forEach(v => v.style.display = 'none');

    // Show target view
    const target = document.getElementById(`view-${tabName}`);
    if (target) {
      target.style.display = 'block';
    }

    // Refresh view specific contents
    if (tabName === 'dashboard') {
      this.renderDashboard();
    } else if (tabName === 'students') {
      this.renderStudentsList();
    } else if (tabName === 'faculty-admin') {
      this.renderFacultyAdmin();
    } else if (tabName === 'community') {
      this.renderCommunityList();
    } else if (tabName === 'predict') {
      this.renderPredictView();
    } else if (tabName === 'suggestions') {
      this.renderSuggestionsView();
    } else if (tabName === 'reports') {
      this.renderReportsView();
    } else if (tabName === 'simulator') {
      this.initSimulator();
    }
  },

  /**
   * Distinct Role Dashboard Dispatcher
   */
  renderDashboard() {
    const container = document.getElementById('dashboardRoleContainer');
    if (!container || !this.currentUser) return;

    if (this.currentUser.role === 'admin') {
      this.renderAdminDashboard(container);
    } else if (this.currentUser.role === 'faculty') {
      this.renderFacultyDashboard(container);
    } else {
      this.renderStudentDashboard(container);
    }
  },

  /**
   * 1. ADMIN DASHBOARD
   */
  renderAdminDashboard(container) {
    const students = Storage.getStudents();
    const facultyList = Storage.getFacultyList();
    const totalStudents = students.length;
    let totalRecords = 0;
    let totalAtt = 0;
    let totalScore = 0;
    let criticalCount = 0;

    students.forEach(s => {
      if (s.academic_records && s.academic_records.length > 0) {
        totalRecords += s.academic_records.length;
        const lastRec = s.academic_records[s.academic_records.length - 1];
        totalAtt += parseFloat(lastRec.attendance_pct || 0);
        const pred = MLEngine.predict(lastRec);
        totalScore += pred.predicted_percentage;
        if (pred.risk_code === 'critical') criticalCount++;
      }
    });

    const avgAtt = totalStudents > 0 ? (totalAtt / totalStudents).toFixed(1) : "0.0";
    const avgScore = totalStudents > 0 ? (totalScore / totalStudents).toFixed(1) : "0.0";

    container.innerHTML = `
      <!-- Admin Scope Banner -->
      <div class="scope-banner">
        <div>
          <span style="font-weight: 700; color: #fff;">🏛️ Administrator Executive Console</span>
          <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 8px;">Full institutional oversight & management</span>
        </div>
        <span class="scope-pill">👑 Full System Privileges</span>
      </div>

      <!-- Institutional KPIs -->
      <div class="grid-stats">
        <div class="card-3d stat-card">
          <div class="stat-icon primary">👥</div>
          <div>
            <div class="stat-value">${totalStudents}</div>
            <div class="stat-label">Total Students</div>
          </div>
        </div>
        <div class="card-3d stat-card">
          <div class="stat-icon cyan">👩‍🏫</div>
          <div>
            <div class="stat-value">${facultyList.length}</div>
            <div class="stat-label">Faculty Members</div>
          </div>
        </div>
        <div class="card-3d stat-card">
          <div class="stat-icon success">📅</div>
          <div class="stat-value">${avgAtt}%</div>
          <div class="stat-label">Campus Attendance</div>
        </div>
        <div class="card-3d stat-card">
          <div class="stat-icon warning">🏆</div>
          <div>
            <div class="stat-value">${avgScore}%</div>
            <div class="stat-label">Cohort Mean Score</div>
          </div>
        </div>
      </div>

      <!-- Quick Roster & Management Shortcuts -->
      <div class="grid-2col">
        <div class="card-3d">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <h3 style="font-size: 1.05rem; font-weight: 700;">⚡ Quick Student Roster (All Departments)</h3>
            <button class="btn btn-secondary btn-sm" onclick="App.switchTab('students')">View All (${totalStudents})</button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Name</th>
                  <th>Dept</th>
                  <th>Class</th>
                  <th>Attendance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${students.slice(0, 5).map(s => {
                  const lastRec = (s.academic_records && s.academic_records.length > 0) ? s.academic_records[s.academic_records.length - 1] : { attendance_pct: '--' };
                  return `
                    <tr>
                      <td><code>${s.register_number}</code></td>
                      <td><strong>${s.full_name}</strong></td>
                      <td>${s.department}</td>
                      <td>Yr ${s.year} • ${s.section || 'Sec A'}</td>
                      <td>${lastRec.attendance_pct}%</td>
                      <td>
                        <div style="display: flex; gap: 4px;">
                          <button class="btn btn-secondary btn-sm" onclick="App.openStudentProfile(${s.id})">Profile</button>
                          <button class="btn btn-cyan btn-sm" onclick="App.generatePrediction(${s.id})">Predict</button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card-3d">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <h3 style="font-size: 1.05rem; font-weight: 700;">👩‍🏫 Active Faculty & Assigned Cohorts</h3>
            <button class="btn btn-primary btn-sm" onclick="App.switchTab('faculty-admin')">Manage All</button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Faculty</th>
                  <th>Department</th>
                  <th>Assigned Scope</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${facultyList.map(f => `
                  <tr>
                    <td><strong>${f.full_name}</strong></td>
                    <td>${f.department}</td>
                    <td><span class="assignment-badge">${f.assigned_department || f.department}</span></td>
                    <td>
                      <button class="btn btn-secondary btn-sm" onclick="App.openAssignFacultyModal('${f.email}')">⚙️ Assign</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div style="margin-top: 14px; display: flex; gap: 8px;">
            <button class="btn btn-primary btn-sm" onclick="App.openAddFacultyModal()">➕ Add Faculty</button>
            <button class="btn btn-cyan btn-sm" onclick="App.switchTab('reports')">📑 Cohort Risk Audit</button>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 2. FACULTY DASHBOARD
   */
  renderFacultyDashboard(container) {
    const user = this.currentUser;
    const assignedStudents = Storage.getAccessibleStudents(user);
    const totalAssigned = assignedStudents.length;

    let totalAtt = 0;
    let totalScore = 0;
    let totalInternals = 0;
    let criticalCount = 0;

    assignedStudents.forEach(s => {
      if (s.academic_records && s.academic_records.length > 0) {
        const lastRec = s.academic_records[s.academic_records.length - 1];
        totalAtt += parseFloat(lastRec.attendance_pct || 0);
        totalInternals += parseFloat(lastRec.internal_score || 0);
        const pred = MLEngine.predict(lastRec);
        totalScore += pred.predicted_percentage;
        if (pred.risk_code === 'critical') criticalCount++;
      }
    });

    const avgAtt = totalAssigned > 0 ? (totalAtt / totalAssigned).toFixed(1) : "0.0";
    const avgScore = totalAssigned > 0 ? (totalScore / totalAssigned).toFixed(1) : "0.0";
    const avgInternals = totalAssigned > 0 ? (totalInternals / totalAssigned).toFixed(1) : "0.0";

    const assignedDept = user.assigned_department || user.department || "Computer Science";
    const assignedYear = user.assigned_year || "All Years";
    const assignedSec = user.assigned_section || "All Sections";

    container.innerHTML = `
      <!-- Scope Banner -->
      <div class="scope-banner">
        <div>
          <span style="font-weight: 700; color: #fff;">👩‍🏫 Assigned Academic Scope:</span>
          <span style="color: var(--accent-cyan); font-weight: 600; margin-left: 6px;">${assignedDept}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 8px;">(${assignedYear} • ${assignedSec})</span>
        </div>
        <span class="scope-pill">🔒 Department-Scoped Access</span>
      </div>

      <!-- Class Statistics -->
      <div class="grid-stats">
        <div class="card-3d stat-card">
          <div class="stat-icon primary">👨‍🎓</div>
          <div>
            <div class="stat-value">${totalAssigned}</div>
            <div class="stat-label">Assigned Students</div>
          </div>
        </div>
        <div class="card-3d stat-card">
          <div class="stat-icon cyan">📊</div>
          <div>
            <div class="stat-value">${avgScore}%</div>
            <div class="stat-label">Class Predicted Mean</div>
          </div>
        </div>
        <div class="card-3d stat-card">
          <div class="stat-icon success">📅</div>
          <div>
            <div class="stat-value">${avgAtt}%</div>
            <div class="stat-label">Class Attendance %</div>
          </div>
        </div>
        <div class="card-3d stat-card">
          <div class="stat-icon warning">✍️</div>
          <div>
            <div class="stat-value">${avgInternals}%</div>
            <div class="stat-label">Class Internal Mean</div>
          </div>
        </div>
      </div>

      <!-- Assigned Students Grading & Prediction Table -->
      <div class="card-3d" style="margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 700;">📝 Quick Marks & Evaluation Roster</h3>
            <p style="font-size: 0.78rem; color: var(--text-muted);">Manage marks, attendance, and generate AI insights for your assigned students.</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="App.switchTab('students')">Full Class Directory</button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Reg No</th>
                <th>Student Name</th>
                <th>Class / Sec</th>
                <th>Attendance %</th>
                <th>Internals %</th>
                <th>Predicted Score</th>
                <th>Risk Tier</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              ${assignedStudents.map(s => {
                const rec = (s.academic_records && s.academic_records.length > 0) ? s.academic_records[s.academic_records.length - 1] : { attendance_pct: 0, internal_score: 0 };
                const pred = MLEngine.predict(rec);
                return `
                  <tr>
                    <td><code>${s.register_number}</code></td>
                    <td><strong>${s.full_name}</strong></td>
                    <td>Yr ${s.year} • ${s.section || 'Sec A'}</td>
                    <td>${rec.attendance_pct}%</td>
                    <td>${rec.internal_score}%</td>
                    <td><strong>${pred.predicted_percentage}%</strong></td>
                    <td><span class="badge badge-${pred.risk_code}-risk">${pred.risk_level}</span></td>
                    <td>
                      <div style="display: flex; gap: 4px;">
                        <button class="btn btn-primary btn-sm" onclick="App.openAcademicRecordModal(${s.id})">➕ Edit Marks</button>
                        <button class="btn btn-cyan btn-sm" onclick="App.generatePrediction(${s.id})">🧠 Predict</button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /**
   * 3. STUDENT DASHBOARD (Personal Performance Cockpit)
   */
  renderStudentDashboard(container) {
    const user = this.currentUser;
    const accessible = Storage.getAccessibleStudents(user);
    const student = accessible.length > 0 ? accessible[0] : null;

    if (!student) {
      container.innerHTML = `<div class="card-3d"><p>Student profile not found. Please contact administration.</p></div>`;
      return;
    }

    const rec = (student.academic_records && student.academic_records.length > 0)
      ? student.academic_records[student.academic_records.length - 1]
      : { attendance_pct: 85, assignment_score: 80, internal_score: 75, previous_sem_score: 75, subject_marks: [] };

    const pred = MLEngine.predict(rec);
    const sug = SuggestionsEngine.generate(student, rec, pred);

    container.innerHTML = `
      <!-- Welcome Cockpit Banner -->
      <div class="scope-banner" style="background: linear-gradient(90deg, rgba(99, 102, 241, 0.18), rgba(6, 182, 212, 0.12));">
        <div>
          <span style="font-size: 1.15rem; font-weight: 800; color: #fff;">👋 Welcome back, ${student.full_name}!</span>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 3px;">
            ${student.department} • Year ${student.year} (Sem ${student.semester}) • ${student.section || 'Section A'} • Reg: <code>${student.register_number}</code>
          </div>
        </div>
        <span class="scope-pill">🎓 Student Performance Cockpit</span>
      </div>

      <!-- Student Personal Predictor & Analytics Grid -->
      <div class="grid-prediction">
        <!-- 3D Score Holographic Card -->
        <div class="card-3d holo-card">
          <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--accent-cyan); font-weight: 700; letter-spacing: 1px;">
            🧠 My AI Forecast
          </div>
          <h3 style="font-size: 1.25rem; margin-top: 6px; font-weight: 800;">${student.full_name}</h3>
          <p style="font-size: 0.78rem; color: var(--text-muted);">${student.department} • Sem ${student.semester}</p>

          <!-- Circular Score Gauge -->
          <div class="score-circle-container">
            <svg class="score-circle-svg" viewBox="0 0 160 160">
              <circle class="score-circle-bg" cx="80" cy="80" r="68"></circle>
              <circle class="score-circle-progress" cx="80" cy="80" r="68" style="stroke-dashoffset: calc(427.26 - (427.26 * ${pred.predicted_percentage}) / 100);"></circle>
            </svg>
            <div class="score-value-text">
              <span class="score-num">${pred.predicted_percentage}%</span>
              <span class="score-label">Expected Score</span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px; align-items: center; margin-top: 6px;">
            <span class="badge badge-${pred.tier_code}-tier">${pred.performance_tier} Performance</span>
            <span class="badge badge-${pred.risk_code}-risk">${pred.risk_level}</span>
          </div>
        </div>

        <!-- Academic Vitals & Weakness Alerts -->
        <div class="card-3d">
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 12px;">📊 My Current Academic Metrics</h3>
          <div class="grid-stats" style="margin-bottom: 16px;">
            <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase;">Attendance</div>
              <div style="font-size: 1.3rem; font-weight: 800; color: ${rec.attendance_pct < 75 ? 'var(--danger)' : 'var(--success)'};">${rec.attendance_pct}%</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase;">Internals</div>
              <div style="font-size: 1.3rem; font-weight: 800; color: #fff;">${rec.internal_score}%</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase;">Assignments</div>
              <div style="font-size: 1.3rem; font-weight: 800; color: #fff;">${rec.assignment_score}%</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase;">Prior GPA</div>
              <div style="font-size: 1.3rem; font-weight: 800; color: #fff;">${rec.previous_sem_score}%</div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="App.openTranscriptModal(${student.id})">📑 My Official Transcript</button>
            <button class="btn btn-cyan btn-sm" onclick="App.switchTab('simulator')">🎛️ Run What-If Simulator</button>
            <button class="btn btn-secondary btn-sm" onclick="App.switchTab('suggestions')">💡 View Improvement Plan</button>
            <button class="btn btn-secondary btn-sm" onclick="App.switchTab('community')">🌐 Student Community</button>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Module 1: Student Directory (Admin / Faculty)
   */
  renderStudentsList() {
    const user = this.currentUser;
    if (!user || user.role === 'student') return;

    const banner = document.getElementById('studentsScopeBanner');
    const title = document.getElementById('studentsViewTitle');
    const actionContainer = document.getElementById('studentsViewActionContainer');

    if (user.role === 'admin') {
      if (banner) banner.innerHTML = ``;
      if (title) title.innerText = 'All Registered Students (Institution Directory)';
      if (actionContainer) {
        actionContainer.innerHTML = `
          <button class="btn btn-primary" onclick="App.openAddStudentModal()">
            ➕ Register New Student
          </button>
        `;
      }
    } else {
      // Faculty
      const facultyDept = user.assigned_department || user.department;
      if (banner) {
        banner.innerHTML = `
          <div class="scope-banner">
            <div>
              <strong>Department Scope:</strong> Viewing students enrolled in <strong>${facultyDept}</strong> (${user.assigned_year || 'All Years'} • ${user.assigned_section || 'All Sections'})
            </div>
            <span class="scope-pill">🔒 Faculty Restricted</span>
          </div>
        `;
      }
      if (title) title.innerText = `Assigned Students - ${facultyDept}`;
      if (actionContainer) {
        actionContainer.innerHTML = `
          <span style="font-size: 0.8rem; color: var(--text-muted);">
            Official student registrations are managed by administrators.
          </span>
        `;
      }
    }

    const students = Storage.getAccessibleStudents(user);
    const search = document.getElementById('searchStudentInput')?.value?.toLowerCase() || '';
    const deptFilter = document.getElementById('filterDeptSelect')?.value || 'all';
    const yearFilter = document.getElementById('filterYearSelect')?.value || 'all';
    const semFilter = document.getElementById('filterSemSelect')?.value || 'all';

    const filtered = students.filter(s => {
      const matchSearch = s.full_name.toLowerCase().includes(search) ||
                          s.register_number.toLowerCase().includes(search) ||
                          s.email.toLowerCase().includes(search);
      const matchDept = deptFilter === 'all' || s.department === deptFilter;
      const matchYear = yearFilter === 'all' || s.year.toString() === yearFilter;
      const matchSem = semFilter === 'all' || s.semester.toString() === semFilter;
      return matchSearch && matchDept && matchYear && matchSem;
    });

    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No student records found matching filter criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(s => {
      const lastRec = (s.academic_records && s.academic_records.length > 0) ? s.academic_records[s.academic_records.length - 1] : null;
      const att = lastRec ? `${lastRec.attendance_pct}%` : 'N/A';
      const avg = lastRec ? `${lastRec.calculated_avg || lastRec.internal_score}%` : 'N/A';

      // Role buttons: Admin has Delete button; Faculty has Add/Edit Marks
      const deleteBtn = user.role === 'admin'
        ? `<button class="btn btn-danger btn-sm" onclick="App.handleDeleteStudent(${s.id})">Delete</button>`
        : '';

      return `
        <tr>
          <td><code>${s.register_number}</code></td>
          <td>
            <div style="font-weight: 700; color: #fff;">${s.avatar || '👨‍🎓'} ${s.full_name}</div>
            <div style="font-size: 0.74rem; color: var(--text-muted);">${s.email}</div>
          </td>
          <td>${s.department}</td>
          <td>Year ${s.year} • ${s.section || 'Sec A'}</td>
          <td>${att}</td>
          <td>${avg}</td>
          <td>
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              <button class="btn btn-secondary btn-sm" onclick="App.openStudentProfile(${s.id})">Profile</button>
              <button class="btn btn-primary btn-sm" onclick="App.openAcademicRecordModal(${s.id})">📝 Marks</button>
              <button class="btn btn-cyan btn-sm" onclick="App.generatePrediction(${s.id})">🧠 Predict</button>
              ${deleteBtn}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  /**
   * Faculty & Class Assignment Management (Admin Only)
   */
  renderFacultyAdmin() {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.switchTab('dashboard');
      return;
    }

    const tbody = document.getElementById('facultyAdminTableBody');
    if (!tbody) return;

    const facultyList = Storage.getFacultyList();
    const allStudents = Storage.getStudents();

    if (facultyList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 20px;">No faculty accounts found. Click "Add Faculty Member" above to create one.</td></tr>`;
      return;
    }

    tbody.innerHTML = facultyList.map(f => {
      const assignedDept = f.assigned_department || f.department;
      const assignedYear = f.assigned_year || "All Years";
      const assignedSec = f.assigned_section || "All Sections";

      const matchedStudentsCount = allStudents.filter(s => {
        if (s.department !== assignedDept) return false;
        if (assignedYear !== "All Years") {
          const matchYear = parseInt(assignedYear.replace(/\D/g, ''));
          if (matchYear && s.year !== matchYear) return false;
        }
        if (assignedSec !== "All Sections" && s.section && s.section !== assignedSec) return false;
        return true;
      }).length;

      return `
        <tr>
          <td><strong>${f.full_name}</strong></td>
          <td><code>${f.email}</code></td>
          <td>${f.department}</td>
          <td><span class="assignment-badge" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); border-color: rgba(6,182,212,0.4);">${assignedDept}</span></td>
          <td>${assignedYear}</td>
          <td>${assignedSec}</td>
          <td><strong>${matchedStudentsCount}</strong> students</td>
          <td>
            <div style="display: flex; gap: 4px;">
              <button class="btn btn-primary btn-sm" onclick="App.openAssignFacultyModal('${f.email}')">⚙️ Reassign</button>
              <button class="btn btn-danger btn-sm" onclick="App.handleDeleteFaculty('${f.email}')">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  /**
   * Student Community View (Safe Peer Directory for Students)
   */
  renderCommunityList() {
    const container = document.getElementById('communityGridContainer');
    if (!container) return;

    const peers = Storage.getCommunityStudents();
    const search = document.getElementById('communitySearchInput')?.value?.toLowerCase() || '';
    const deptFilter = document.getElementById('communityFilterDept')?.value || 'all';
    const yearFilter = document.getElementById('communityFilterYear')?.value || 'all';

    const filtered = peers.filter(p => {
      const matchSearch = p.full_name.toLowerCase().includes(search) || p.department.toLowerCase().includes(search);
      const matchDept = deptFilter === 'all' || p.department === deptFilter;
      const matchYear = yearFilter === 'all' || p.year.toString() === yearFilter;
      return matchSearch && matchDept && matchYear;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">No classmates found matching search.</div>`;
      return;
    }

    container.innerHTML = filtered.map(p => `
      <div class="peer-card">
        <div class="peer-avatar">${p.avatar || '👨‍🎓'}</div>
        <div class="peer-name">${p.full_name}</div>
        <div class="peer-dept">${p.department}</div>
        <div class="peer-tags">
          <span class="peer-tag">Year ${p.year} (Sem ${p.semester})</span>
          <span class="peer-tag" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan);">${p.section}</span>
        </div>
      </div>
    `).join('');
  },

  /**
   * Module 2: AI Predictor View
   */
  renderPredictView() {
    const user = this.currentUser;
    if (!user) return;

    const accessible = Storage.getAccessibleStudents(user);
    if (accessible.length === 0) return;

    const selectWrapper = document.getElementById('predictStudentSelectWrapper');
    const select = document.getElementById('predictStudentSelect');
    const matrixCard = document.getElementById('cohortPredictMatrixCard');

    if (user.role === 'student') {
      if (selectWrapper) selectWrapper.style.display = 'none';
      if (matrixCard) matrixCard.style.display = 'none'; // Students cannot view other students' predictions
      this.currentSelectedStudentId = accessible[0].id;
    } else {
      if (selectWrapper) selectWrapper.style.display = 'flex';
      if (matrixCard) matrixCard.style.display = 'block';

      if (select) {
        select.innerHTML = accessible.map(s => `
          <option value="${s.id}" ${s.id === this.currentSelectedStudentId ? 'selected' : ''}>
            ${s.full_name} (${s.register_number}) - ${s.department}
          </option>
        `).join('');
      }

      if (!accessible.some(s => s.id === this.currentSelectedStudentId)) {
        this.currentSelectedStudentId = accessible[0].id;
      }
    }

    this.displayPredictionForStudent(this.currentSelectedStudentId);

    // Populate Batch Risk Table for Admin / Faculty
    if (user.role !== 'student') {
      const tbody = document.getElementById('batchPredictTableBody');
      if (tbody) {
        tbody.innerHTML = accessible.map(s => {
          const rec = (s.academic_records && s.academic_records.length > 0) ? s.academic_records[s.academic_records.length - 1] : { attendance_pct: 0, internal_score: 0 };
          const pred = MLEngine.predict(rec);
          return `
            <tr>
              <td><code>${s.register_number}</code></td>
              <td><strong>${s.full_name}</strong></td>
              <td>${s.department}</td>
              <td>${rec.attendance_pct}%</td>
              <td><strong>${pred.predicted_percentage}%</strong></td>
              <td><span class="badge badge-${pred.risk_code}-risk">${pred.risk_level}</span></td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="App.generatePrediction(${s.id})">Deep Dive</button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  },

  handlePredictSelectChange(val) {
    this.currentSelectedStudentId = Number(val);
    this.displayPredictionForStudent(this.currentSelectedStudentId);
  },

  displayPredictionForStudent(studentId) {
    const s = Storage.getStudentById(studentId);
    if (!s) return;

    const rec = (s.academic_records && s.academic_records.length > 0)
      ? s.academic_records[s.academic_records.length - 1]
      : { attendance_pct: 75, assignment_score: 70, internal_score: 70, previous_sem_score: 70, subject_marks: [] };

    const pred = MLEngine.predict(rec);

    document.getElementById('predStudentTitle').innerText = `${s.full_name} (${s.register_number})`;
    document.getElementById('predStudentMeta').innerText = `${s.department} • Sem ${s.semester} • ${s.section || 'Sec A'}`;
    document.getElementById('predictionScoreValue').innerText = `${pred.predicted_percentage}%`;

    const circle = document.getElementById('predictionProgressCircle');
    if (circle) {
      const circ = 427.26;
      circle.style.strokeDashoffset = circ - (circ * pred.predicted_percentage) / 100;
    }

    const tierBadge = document.getElementById('predTierBadge');
    if (tierBadge) {
      tierBadge.innerText = `${pred.performance_tier} Performance`;
      tierBadge.className = `badge badge-${pred.tier_code}-tier`;
    }

    const riskBadge = document.getElementById('predRiskBadge');
    if (riskBadge) {
      riskBadge.innerText = pred.risk_level;
      riskBadge.className = `badge badge-${pred.risk_code}-risk`;
    }

    const factorsContainer = document.getElementById('predictionFactorsList');
    if (factorsContainer) {
      factorsContainer.innerHTML = pred.factors.map(f => `
        <div class="factor-item">
          <div style="font-weight: 700; color: #fff; display: flex; justify-content: space-between;">
            <span>${f.factor}</span>
            <span class="badge badge-${f.impact_code === 'positive' ? 'low-risk' : (f.impact_code === 'negative' ? 'critical-risk' : 'moderate-risk')}">${f.impact}</span>
          </div>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">${f.description}</p>
        </div>
      `).join('');
    }
  },

  generatePrediction(studentId) {
    if (!Storage.canAccessStudent(this.currentUser, studentId)) {
      this.showToast('Access Denied: You do not have permission to view this student.', 'error');
      return;
    }
    this.currentSelectedStudentId = studentId;
    this.switchTab('predict');
  },

  /**
   * Module 3: AI Suggestions View
   */
  renderSuggestionsView() {
    const user = this.currentUser;
    if (!user) return;

    const accessible = Storage.getAccessibleStudents(user);
    if (accessible.length === 0) return;

    const selectWrapper = document.getElementById('sugStudentSelectWrapper');
    const select = document.getElementById('sugStudentSelect');

    if (user.role === 'student') {
      if (selectWrapper) selectWrapper.style.display = 'none';
      this.currentSelectedStudentId = accessible[0].id;
    } else {
      if (selectWrapper) selectWrapper.style.display = 'flex';
      if (select) {
        select.innerHTML = accessible.map(s => `
          <option value="${s.id}" ${s.id === this.currentSelectedStudentId ? 'selected' : ''}>
            ${s.full_name} (${s.register_number}) - ${s.department}
          </option>
        `).join('');
      }

      if (!accessible.some(s => s.id === this.currentSelectedStudentId)) {
        this.currentSelectedStudentId = accessible[0].id;
      }
    }

    this.displaySuggestionsForStudent(this.currentSelectedStudentId);
  },

  handleSuggestionsSelectChange(val) {
    this.currentSelectedStudentId = Number(val);
    this.displaySuggestionsForStudent(this.currentSelectedStudentId);
  },

  displaySuggestionsForStudent(studentId) {
    const s = Storage.getStudentById(studentId);
    if (!s) return;

    const rec = (s.academic_records && s.academic_records.length > 0)
      ? s.academic_records[s.academic_records.length - 1]
      : { attendance_pct: 75, assignment_score: 70, internal_score: 70, previous_sem_score: 70, subject_marks: [] };

    const pred = MLEngine.predict(rec);
    const sug = SuggestionsEngine.generate(s, rec, pred);

    document.getElementById('sugStudentTitle').innerText = `${s.full_name} (${s.register_number})`;
    document.getElementById('sugStudentMeta').innerText = `${s.department} • Sem ${s.semester} • ${s.section || 'Sec A'}`;
    document.getElementById('sugCurrentScore').innerText = `${sug.current_predicted_score}%`;
    document.getElementById('sugTargetScore').innerText = `${sug.target_projected_score}%`;
    document.getElementById('sugPotentialGain').innerText = `${sug.total_potential_gain} Gain`;

    document.getElementById('sugCriticalCount').innerText = sug.critical_priority_count;
    document.getElementById('sugHighCount').innerText = sug.high_priority_count;
    document.getElementById('sugMediumCount').innerText = sug.medium_priority_count;

    const attBox = document.getElementById('sugAttendanceRecoveryBox');
    if (sug.attendance_recovery) {
      const ar = sug.attendance_recovery;
      attBox.innerHTML = `
        <div class="card-3d" style="border-left: 4px solid var(--danger); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h4 style="color: var(--danger); font-size: 1rem;">🚨 ${ar.title}</h4>
            <span class="badge badge-critical-risk">${ar.priority} Priority (${ar.estimated_gain})</span>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 10px;">${ar.description}</p>
          <ul style="padding-left: 20px; font-size: 0.8rem; color: var(--text-muted);">
            ${ar.action_items.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>
      `;
    } else {
      attBox.innerHTML = ``;
    }

    const weakContainer = document.getElementById('sugWeakSubjectsList');
    if (sug.weak_subjects.length > 0) {
      weakContainer.innerHTML = sug.weak_subjects.map(ws => `
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); padding: 14px; border-radius: var(--radius-md); margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #fff; font-size: 0.95rem;">${ws.subject} (${ws.current_score}%)</strong>
            <span class="badge badge-${ws.priority_code}-risk">${ws.priority} Priority</span>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-muted);">${ws.action_plan}</p>
          <div style="font-size: 0.75rem; color: var(--accent-cyan); margin-top: 6px; font-weight: 600;">
            ⏳ Recommended Effort: ${ws.recommended_weekly_hours} hrs/week
          </div>
        </div>
      `).join('');
    } else {
      weakContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.84rem;">All enrolled subjects are currently meeting high-performance thresholds!</p>`;
    }
  },

  /**
   * Module 4: Reports & Analytics
   */
  renderReportsView() {
    const user = this.currentUser;
    if (!user) return;

    const accessible = Storage.getAccessibleStudents(user);
    const total = accessible.length;

    let totalScore = 0;
    let totalAtt = 0;
    let passCount = 0;
    let criticalCount = 0;

    accessible.forEach(s => {
      const rec = (s.academic_records && s.academic_records.length > 0) ? s.academic_records[s.academic_records.length - 1] : { attendance_pct: 0, internal_score: 0 };
      const pred = MLEngine.predict(rec);
      totalScore += pred.predicted_percentage;
      totalAtt += parseFloat(rec.attendance_pct || 0);
      if (pred.predicted_percentage >= 50) passCount++;
      if (pred.risk_code === 'critical') criticalCount++;
    });

    const avgScore = total > 0 ? (totalScore / total).toFixed(1) : "0.0";
    const avgAtt = total > 0 ? (totalAtt / total).toFixed(1) : "0.0";
    const passRate = total > 0 ? ((passCount / total) * 100).toFixed(1) : "0.0";

    document.getElementById('repTotalStudents').innerText = total;
    document.getElementById('repAvgScore').innerText = `${avgScore}%`;
    document.getElementById('repPassRate').innerText = `${passRate}%`;
    document.getElementById('repAvgAttendance').innerText = `${avgAtt}%`;
    document.getElementById('repCriticalCount').innerText = criticalCount;

    const heading = document.getElementById('reportsHeading');
    if (heading) {
      heading.innerText = user.role === 'admin'
        ? 'Institutional Performance & Risk Roster (All Departments)'
        : (user.role === 'faculty' ? `Class Performance Roster (${user.assigned_department || user.department})` : 'My Academic Records & Transcript');
    }

    const tbody = document.getElementById('reportRosterTableBody');
    if (tbody) {
      tbody.innerHTML = accessible.map(s => {
        const rec = (s.academic_records && s.academic_records.length > 0) ? s.academic_records[s.academic_records.length - 1] : { attendance_pct: 0, internal_score: 0 };
        const pred = MLEngine.predict(rec);
        return `
          <tr>
            <td><code>${s.register_number}</code></td>
            <td><strong>${s.full_name}</strong></td>
            <td>${s.department}</td>
            <td>Yr ${s.year} • ${s.section || 'Sec A'}</td>
            <td>${rec.attendance_pct}%</td>
            <td>${rec.internal_score}%</td>
            <td><strong>${pred.predicted_percentage}%</strong></td>
            <td><span class="badge badge-${pred.risk_code}-risk">${pred.risk_level}</span></td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="App.openTranscriptModal(${s.id})">Official Transcript</button>
            </td>
          </tr>
        `;
      }).join('');
    }
  },

  /**
   * What-If Simulator
   */
  initSimulator() {
    const sAtt = document.getElementById('simAttendance');
    const sAsn = document.getElementById('simAssignment');
    const sItr = document.getElementById('simInternals');
    const sPrv = document.getElementById('simPrevSem');

    const update = () => {
      const att = parseFloat(sAtt.value);
      const asn = parseFloat(sAsn.value);
      const itr = parseFloat(sItr.value);
      const prv = parseFloat(sPrv.value);

      document.getElementById('simAttendanceVal').innerText = `${att}%`;
      document.getElementById('simAssignmentVal').innerText = `${asn}%`;
      document.getElementById('simInternalsVal').innerText = `${itr}%`;
      document.getElementById('simPrevSemVal').innerText = `${prv}%`;

      const pred = MLEngine.predict({
        attendance_pct: att,
        assignment_score: asn,
        internal_score: itr,
        previous_sem_score: prv
      });

      document.getElementById('simPredictedScore').innerText = `${pred.predicted_percentage}%`;

      const tBadge = document.getElementById('simTierBadge');
      tBadge.innerText = `${pred.performance_tier} Performance`;
      tBadge.className = `badge badge-${pred.tier_code}-tier`;

      const rBadge = document.getElementById('simRiskBadge');
      rBadge.innerText = pred.risk_level;
      rBadge.className = `badge badge-${pred.risk_code}-risk`;

      const preview = document.getElementById('simFactorsPreview');
      if (preview) {
        preview.innerHTML = pred.factors.map(f => `
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 4px;">
            • <strong>${f.factor}:</strong> ${f.impact}
          </div>
        `).join('');
      }
    };

    sAtt.oninput = update;
    sAsn.oninput = update;
    sItr.oninput = update;
    sPrv.oninput = update;

    update();
  },

  /**
   * Action Handlers & Modals with Permission Guards
   */
  openAddStudentModal() {
    if (this.currentUser.role !== 'admin') {
      this.showToast('Access Denied: Only administrators can register new students.', 'error');
      return;
    }
    this.openModal('addStudentModal');
  },

  handleAddStudentSubmit(e) {
    e.preventDefault();
    if (this.currentUser.role !== 'admin') {
      this.showToast('Access Denied: Only administrators can add students.', 'error');
      return;
    }

    const regNo = document.getElementById('newRegNo').value.trim().toUpperCase();
    const fullName = document.getElementById('newFullName').value.trim();
    const email = document.getElementById('newEmail').value.trim();
    const dept = document.getElementById('newDept').value;
    const year = Number(document.getElementById('newYear').value);
    const sem = Number(document.getElementById('newSem').value);
    const section = document.getElementById('newSection').value;
    const phone = document.getElementById('newPhone').value.trim();
    const avatar = document.getElementById('newAvatar').value;

    const newStudent = {
      id: Date.now(),
      register_number: regNo,
      full_name: fullName,
      email,
      department: dept,
      year,
      semester: sem,
      section,
      avatar,
      contact_number: phone,
      academic_records: [
        {
          id: Date.now() + 1,
          semester: sem,
          attendance_pct: 82.0,
          assignment_score: 78.0,
          internal_score: 72.0,
          previous_sem_score: 75.0,
          notes: "Initial registration semester record",
          subject_marks: [
            { subject_name: "Core Module 1", marks_obtained: 78, max_marks: 100 },
            { subject_name: "Core Module 2", marks_obtained: 74, max_marks: 100 }
          ]
        }
      ]
    };

    Storage.saveStudent(newStudent);
    this.closeModal('addStudentModal');
    this.showToast(`Student ${fullName} registered successfully!`, 'success');
    this.renderStudentsList();
    if (this.activeTab === 'dashboard') this.renderDashboard();
  },

  openAddFacultyModal() {
    if (this.currentUser.role !== 'admin') {
      this.showToast('Access Denied: Only administrators can manage faculty accounts.', 'error');
      return;
    }
    this.openModal('addFacultyModal');
  },

  handleAddFacultySubmit(e) {
    e.preventDefault();
    if (this.currentUser.role !== 'admin') {
      this.showToast('Access Denied: Only administrators can create faculty accounts.', 'error');
      return;
    }

    const name = document.getElementById('newFacultyName').value.trim();
    const email = document.getElementById('newFacultyEmail').value.trim();
    const dept = document.getElementById('newFacultyDept').value;
    const assignDept = document.getElementById('newFacultyAssignDept').value;
    const assignYear = document.getElementById('newFacultyAssignYear').value;
    const assignSec = document.getElementById('newFacultyAssignSec').value;
    const pass = document.getElementById('newFacultyPassword').value.trim();

    if (Storage.getUsers().some(u => u.email.toLowerCase() === email.toLowerCase())) {
      this.showToast('An account with this email already exists.', 'error');
      return;
    }

    const newFaculty = {
      full_name: name,
      email,
      password: pass,
      role: 'faculty',
      department: dept,
      assigned_department: assignDept,
      assigned_year: assignYear,
      assigned_section: assignSec
    };

    Storage.addUser(newFaculty);
    this.closeModal('addFacultyModal');
    this.showToast(`Faculty account for ${name} created successfully!`, 'success');
    this.renderFacultyAdmin();
    if (this.activeTab === 'dashboard') this.renderDashboard();
  },

  openAssignFacultyModal(email) {
    if (this.currentUser.role !== 'admin') {
      this.showToast('Access Denied: Only administrators can assign faculty student scopes.', 'error');
      return;
    }

    const faculty = Storage.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!faculty) return;

    document.getElementById('assignFacultyEmail').value = faculty.email;
    document.getElementById('assignFacultyNameDisplay').innerText = faculty.full_name;
    document.getElementById('assignFacultyEmailDisplay').innerText = faculty.email;

    document.getElementById('assignDeptSelect').value = faculty.assigned_department || faculty.department;
    document.getElementById('assignYearSelect').value = faculty.assigned_year || "All Years";
    document.getElementById('assignSectionSelect').value = faculty.assigned_section || "All Sections";

    this.openModal('assignFacultyModal');
  },

  handleAssignFacultySubmit(e) {
    e.preventDefault();
    if (this.currentUser.role !== 'admin') {
      this.showToast('Access Denied: Only administrators can reassign faculty scopes.', 'error');
      return;
    }

    const email = document.getElementById('assignFacultyEmail').value;
    const dept = document.getElementById('assignDeptSelect').value;
    const year = document.getElementById('assignYearSelect').value;
    const section = document.getElementById('assignSectionSelect').value;

    Storage.assignFaculty(email, dept, year, section);
    this.closeModal('assignFacultyModal');
    this.showToast(`Updated student scope for faculty member!`, 'success');
    this.renderFacultyAdmin();
    if (this.activeTab === 'dashboard') this.renderDashboard();
  },

  handleDeleteFaculty(email) {
    if (this.currentUser.role !== 'admin') {
      this.showToast('Access Denied: Only administrators can delete faculty accounts.', 'error');
      return;
    }
    if (confirm(`Are you sure you want to remove faculty account ${email}?`)) {
      Storage.deleteFaculty(email);
      this.showToast('Faculty account removed.', 'info');
      this.renderFacultyAdmin();
      if (this.activeTab === 'dashboard') this.renderDashboard();
    }
  },

  handleDeleteStudent(id) {
    if (this.currentUser.role !== 'admin') {
      this.showToast('Access Denied: Only administrators can delete student records.', 'error');
      return;
    }
    const s = Storage.getStudentById(id);
    if (!s) return;

    if (confirm(`Permanently delete academic profile for ${s.full_name} (${s.register_number})?`)) {
      Storage.deleteStudent(id);
      this.showToast(`Student ${s.full_name} deleted.`, 'info');
      this.renderStudentsList();
      if (this.activeTab === 'dashboard') this.renderDashboard();
    }
  },

  openStudentProfile(studentId) {
    if (!Storage.canAccessStudent(this.currentUser, studentId)) {
      this.showToast('Access Denied: You do not have permission to view this student profile.', 'error');
      return;
    }

    const s = Storage.getStudentById(studentId);
    if (!s) return;

    document.getElementById('profileRegNo').innerText = s.register_number;
    document.getElementById('profileFullName').innerText = `${s.avatar || '👨‍🎓'} ${s.full_name}`;
    document.getElementById('profileEmail').innerText = s.email;
    document.getElementById('profileDept').innerText = s.department;
    document.getElementById('profileYearSem').innerText = `Year ${s.year} / Sem ${s.semester} • ${s.section || 'Sec A'}`;
    document.getElementById('profilePhone').innerText = s.contact_number || 'N/A';

    const recordsBody = document.getElementById('profileRecordsBody');
    if (s.academic_records && s.academic_records.length > 0) {
      recordsBody.innerHTML = s.academic_records.map(r => `
        <tr>
          <td>Sem ${r.semester}</td>
          <td>${r.attendance_pct}%</td>
          <td>${r.assignment_score}%</td>
          <td>${r.internal_score}%</td>
          <td>${r.previous_sem_score}%</td>
          <td><strong>${r.calculated_avg || r.internal_score}%</strong></td>
        </tr>
      `).join('');
    } else {
      recordsBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No records logged yet.</td></tr>`;
    }

    document.getElementById('btnProfilePredict').onclick = () => {
      this.closeModal('studentProfileModal');
      this.generatePrediction(s.id);
    };

    this.openModal('studentProfileModal');
  },

  openAcademicRecordModal(studentId) {
    if (!Storage.canEditStudent(this.currentUser, studentId)) {
      this.showToast('Access Denied: You do not have permission to edit records for this student.', 'error');
      return;
    }

    const s = Storage.getStudentById(studentId);
    if (!s) return;

    document.getElementById('recStudentId').value = s.id;
    document.getElementById('recModalStudentName').innerText = `${s.full_name} (${s.register_number} - ${s.department})`;

    const lastRec = (s.academic_records && s.academic_records.length > 0)
      ? s.academic_records[s.academic_records.length - 1]
      : { attendance_pct: 85, assignment_score: 80, internal_score: 75, previous_sem_score: 75, notes: "", subject_marks: [] };

    document.getElementById('recSemester').value = s.semester;
    document.getElementById('recAttendance').value = lastRec.attendance_pct;
    document.getElementById('recAssignment').value = lastRec.assignment_score;
    document.getElementById('recInternals').value = lastRec.internal_score;
    document.getElementById('recPrevSem').value = lastRec.previous_sem_score;
    document.getElementById('recNotes').value = lastRec.notes || "";

    const list = document.getElementById('subjectMarksList');
    list.innerHTML = '';
    if (lastRec.subject_marks && lastRec.subject_marks.length > 0) {
      lastRec.subject_marks.forEach(sm => this.addSubjectRow(sm.subject_name, sm.marks_obtained, sm.max_marks));
    } else {
      this.addSubjectRow("Core Subject 1", 85, 100);
      this.addSubjectRow("Core Subject 2", 80, 100);
    }

    this.openModal('academicRecordModal');
  },

  addSubjectRow(name = '', marks = 80, max = 100) {
    const list = document.getElementById('subjectMarksList');
    const div = document.createElement('div');
    div.className = 'subject-row';
    div.innerHTML = `
      <input type="text" class="form-input sub-name" placeholder="Subject Name" value="${name}" required />
      <input type="number" class="form-input sub-marks" placeholder="Marks" value="${marks}" min="0" max="100" required />
      <input type="number" class="form-input sub-max" placeholder="Max" value="${max}" min="1" max="100" required />
      <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()">✕</button>
    `;
    list.appendChild(div);
  },

  handleSaveAcademicRecord(e) {
    e.preventDefault();
    const studentId = Number(document.getElementById('recStudentId').value);

    if (!Storage.canEditStudent(this.currentUser, studentId)) {
      this.showToast('Access Denied: Permission error.', 'error');
      return;
    }

    const sem = Number(document.getElementById('recSemester').value);
    const att = parseFloat(document.getElementById('recAttendance').value);
    const asn = parseFloat(document.getElementById('recAssignment').value);
    const itr = parseFloat(document.getElementById('recInternals').value);
    const prv = parseFloat(document.getElementById('recPrevSem').value);
    const notes = document.getElementById('recNotes').value;

    const subRows = document.querySelectorAll('#subjectMarksList .subject-row');
    const subjectMarks = [];
    let subSum = 0;

    subRows.forEach(row => {
      const name = row.querySelector('.sub-name').value.trim();
      const obtained = parseFloat(row.querySelector('.sub-marks').value);
      const max = parseFloat(row.querySelector('.sub-max').value);
      if (name) {
        subjectMarks.push({ subject_name: name, marks_obtained: obtained, max_marks: max });
        subSum += (obtained / max) * 100;
      }
    });

    const calculatedAvg = subjectMarks.length > 0 ? Number((subSum / subjectMarks.length).toFixed(1)) : itr;

    const newRecord = {
      semester: sem,
      attendance_pct: att,
      assignment_score: asn,
      internal_score: itr,
      previous_sem_score: prv,
      calculated_avg: calculatedAvg,
      notes,
      subject_marks: subjectMarks
    };

    Storage.addAcademicRecord(studentId, newRecord);
    this.closeModal('academicRecordModal');
    this.showToast('Academic record & subject marks saved successfully!', 'success');
    this.renderStudentsList();
    if (this.activeTab === 'dashboard') this.renderDashboard();
  },

  openTranscriptModal(studentId) {
    if (!Storage.canAccessStudent(this.currentUser, studentId)) {
      this.showToast('Access Denied: You do not have permission to view this transcript.', 'error');
      return;
    }

    const s = Storage.getStudentById(studentId);
    if (!s) return;

    const rec = (s.academic_records && s.academic_records.length > 0)
      ? s.academic_records[s.academic_records.length - 1]
      : { attendance_pct: 75, assignment_score: 70, internal_score: 70, previous_sem_score: 70, subject_marks: [] };

    const pred = MLEngine.predict(rec);
    const sug = SuggestionsEngine.generate(s, rec, pred);

    document.getElementById('transStudentName').innerText = `${s.avatar || '👨‍🎓'} ${s.full_name}`;
    document.getElementById('transRegNo').innerText = s.register_number;
    document.getElementById('transDept').innerText = s.department;
    document.getElementById('transYearSem').innerText = `Year ${s.year} / Sem ${s.semester} • ${s.section || 'Sec A'}`;
    document.getElementById('transEmail').innerText = s.email;

    document.getElementById('transPredScore').innerText = `${pred.predicted_percentage}%`;
    document.getElementById('transPredTier').innerText = `${pred.performance_tier} Performance`;
    document.getElementById('transRiskLevel').innerText = pred.risk_level;
    document.getElementById('transConfidence').innerText = `92.5% Reliability`;

    const recBody = document.getElementById('transRecordsTableBody');
    if (s.academic_records && s.academic_records.length > 0) {
      recBody.innerHTML = s.academic_records.map(r => `
        <tr>
          <td><strong>Semester ${r.semester}</strong></td>
          <td>${r.attendance_pct}%</td>
          <td>${r.assignment_score}%</td>
          <td>${r.internal_score}%</td>
          <td>${r.previous_sem_score}%</td>
          <td><strong>${r.calculated_avg || r.internal_score}%</strong></td>
        </tr>
      `).join('');
    } else {
      recBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No records logged.</td></tr>`;
    }

    const sugList = document.getElementById('transSuggestionsList');
    if (sug.weak_subjects.length > 0) {
      sugList.innerHTML = sug.weak_subjects.map(ws => `<li><strong>${ws.subject} (${ws.current_score}%):</strong> ${ws.action_plan}</li>`).join('');
    } else {
      sugList.innerHTML = `<li>Performance is consistent across all registered subjects. Maintain current study routine.</li>`;
    }

    this.openModal('transcriptReportModal');
  },

  exportCSV() {
    const accessible = Storage.getAccessibleStudents(this.currentUser);
    let csv = "Register Number,Full Name,Department,Year,Semester,Section,Attendance (%),Internal Marks (%),Predicted Score (%),Performance Tier,Risk Level\n";

    accessible.forEach(s => {
      const rec = (s.academic_records && s.academic_records.length > 0) ? s.academic_records[s.academic_records.length - 1] : { attendance_pct: 75, internal_score: 70 };
      const pred = MLEngine.predict(rec);
      csv += `"${s.register_number}","${s.full_name}","${s.department}",${s.year},${s.semester},"${s.section || 'Section A'}",${rec.attendance_pct},${rec.internal_score},${pred.predicted_percentage},"${pred.performance_tier}","${pred.risk_level}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Student_Performance_Report_${this.currentUser.role}.csv`;
    link.click();
    this.showToast('CSV Report downloaded successfully!', 'success');
  },

  printTranscript() {
    window.print();
  },

  // Modal & Toast Helpers
  openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.add('active');
  },

  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove('active');
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${message}</span>`;
    container.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 300);
    }, 3500);
  },

  bindEvents() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        document.querySelector('.sidebar')?.classList.toggle('open');
      });
    }
  },

  init3DPhysics() {
    // 3D card tilt physics
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.card-3d:hover');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
