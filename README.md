# 🎓 AI Student Performance Predictor (Role-Based Edition)

> A modern, 3D-animated educational intelligence web application that runs **100% offline** and can be opened directly in **Google Chrome** (or any web browser) by double-clicking `index.html`.

---

## ⚡ How to Open & Run Anytime

1. Double-click **[`index.html`](file:///c:/Users/Dell/OneDrive/Desktop/student%20performance/index.html)** in this folder.
2. It opens immediately in your browser via `file://` protocol.
3. **No Python, Node.js, Flask, server, or internet connection is required.**
4. When you close the browser and come back later, double-click `index.html` again — **all your saved users, faculty assignments, and student records remain saved via `localStorage`**.

---

## 🔑 Demo Login Accounts by Role

| Role | Email | Password | Access Scope & Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@edu.ai` | `admin123` | **Full Institutional Access:** View & manage ALL students, add/edit/delete student records, manage & assign Faculty by department/class/section, view all AI predictions, cohort risk matrix & reports. |
| **Faculty (CS)** | `faculty@edu.ai` | `faculty123` | **Computer Science Scope:** View ONLY CS students, add/edit marks, attendance & internals, view AI predictions & class-level analytics. Restricted from other departments. |
| **Faculty (IT)** | `prof.it@edu.ai` | `faculty123` | **Information Technology Scope:** View ONLY IT students, add/edit marks, attendance & internals, view AI predictions & class-level analytics. Restricted from other departments. |
| **Student (CS)** | `student@edu.ai` | `student123` | **Alex Rivera:** View personal academic cockpit, marks, attendance, AI prediction, study plan, What-If simulator, official transcript & Student Community. |
| **Student (IT)** | `priya.it@edu.ai` | `student123` | **Priya Sharma:** View personal academic cockpit, marks, attendance, AI prediction, study plan, What-If simulator, official transcript & Student Community. |

---

## 🛡️ Role-Based Access Control Architecture

### 👑 1. ADMIN
- **Global Student Management**: View, add, edit, and delete student records across all departments.
- **Faculty & Teacher Management**: Add new faculty accounts and dynamically assign/reassign faculty to departments, years, and sections.
- **Academic Grading Oversight**: Update marks, attendance, assignments, and internal scores for any student.
- **Predictive Analytics & Reports**: Access full cohort risk audits, institutional KPIs, and CSV exports.

### 👩‍🏫 2. FACULTY / TEACHER
- **Scoped Student Roster**: Access restricted strictly by JavaScript logic to students in their assigned department/class/section.
- **Academic Evaluation**: Add and edit semester marks, attendance %, assignment scores, and internal test marks for assigned students.
- **AI Prediction & Risk**: View predicted scores, risk categories, and remediation advice for assigned students.
- **Class Analytics**: View class-level pass rates, attendance averages, and risk distributions.
- **Strict Boundary**: Cannot delete students, cannot access unassigned departments, and cannot access Admin settings.

### 👨‍🎓 3. STUDENT
- **Personal Academic Cockpit**: View own marks, attendance, assignments, internals, prior GPA, AI score forecast, and risk level.
- **Interactive Tools**: Full access to the What-If performance simulator, personalized weak-subject study recommendations, and printable official transcript.
- **Student Community (Safe Peer Hub)**: Discover classmates with privacy protection — shows **only** Name, Avatar, Department, Year, and Section.
- **Strict Confidentiality**: Students **cannot** see another student's marks, attendance, internals, GPA, predictions, risk level, or remarks.
- **Integrity**: Students cannot edit official academic records.

---

## 📁 Project Structure

```text
student performance/
├── css/
│   └── style.css       # 3D Tilt, Glassmorphism, Role Badges, Theme & Print Styles
├── js/
│   └── app.js          # Role-Based Storage Manager, ML Engine & UI Controller
├── index.html          # Standalone Single-Page Application (Runs via file://)
└── README.md           # Documentation & Usage Guide
```

---

## 💾 LocalStorage Persistence Guarantee

All user accounts (`edu_ai_users`), active sessions (`edu_ai_active_session`), and student records (`edu_ai_students`) are stored permanently in browser `localStorage`.
All role restrictions and class assignments persist across browser restarts.
