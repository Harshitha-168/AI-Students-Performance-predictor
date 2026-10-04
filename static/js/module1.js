/**
 * Module 1: Student Data Management Controller
 * Handles student registration, profile viewing/editing, search,
 * and academic records CRUD operations.
 */
const Module1 = {
  studentsCache: [],
  currentStudentId: null,
  deptChartInstance: null,

  async loadDashboardStats() {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success && data.stats) {
        const stats = data.stats;
        document.getElementById('statTotalStudents').innerText = stats.total_students;
        document.getElementById('statTotalRecords').innerText = stats.total_records;
        document.getElementById('statAvgAttendance').innerText = `${stats.avg_attendance}%`;
        document.getElementById('statAvgScore').innerText = `${stats.avg_score}%`;

        this.renderDepartmentChart(stats.department_distribution);
      }

      // Also load recent student list preview on dashboard
      this.loadDashboardStudentsPreview();
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    }
  },

  renderDepartmentChart(deptData) {
    const canvas = document.getElementById('chartDepartmentDistribution');
    if (!canvas) return;

    if (this.deptChartInstance) {
      this.deptChartInstance.destroy();
    }

    const labels = deptData.map(d => d.department);
    const counts = deptData.map(d => d.count);

    const ctx = canvas.getContext('2d');
    this.deptChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: counts,
          backgroundColor: [
            '#6366f1',
            '#06b6d4',
            '#8b5cf6',
            '#10b981',
            '#f59e0b'
          ],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', boxWidth: 12, padding: 12, font: { size: 11 } }
          }
        },
        cutout: '70%'
      }
    });
  },

  async loadDashboardStudentsPreview() {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.success) {
        const tbody = document.getElementById('dashboardStudentsTableBody');
        if (!tbody) return;

        const previewList = data.students.slice(0, 5);
        if (previewList.length === 0) {
          tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No students registered yet.</td></tr>`;
          return;
        }

        tbody.innerHTML = previewList.map(st => `
          <tr>
            <td><strong>${st.register_number}</strong></td>
            <td>${st.full_name}</td>
            <td>${st.department}</td>
            <td>Yr ${st.year} / Sem ${st.semester}</td>
            <td>
              <span class="badge ${st.latest_attendance >= 75 ? 'badge-low-risk' : 'badge-critical-risk'}">
                ${st.latest_attendance ? st.latest_attendance + '%' : 'N/A'}
              </span>
            </td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="Module1.viewStudentProfile(${st.id})">
                <i class="fas fa-eye"></i> View
              </button>
            </td>
          </tr>
        `).join('');
      }
    } catch (err) {
      console.error(err);
    }
  },

  async loadStudentsList() {
    const search = document.getElementById('searchStudentInput')?.value || '';
    const dept = document.getElementById('filterDeptSelect')?.value || '';
    const year = document.getElementById('filterYearSelect')?.value || '';
    const sem = document.getElementById('filterSemSelect')?.value || '';

    const url = `/api/students?search=${encodeURIComponent(search)}&department=${encodeURIComponent(dept)}&year=${encodeURIComponent(year)}&semester=${encodeURIComponent(sem)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        this.studentsCache = data.students;
        this.renderStudentsTable(data.students);
      }
    } catch (err) {
      App.showToast('Failed to load students list', 'error');
    }
  },

  renderStudentsTable(students) {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;

    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px; color:#94a3b8;">No matching student records found.</td></tr>`;
      return;
    }

    const isAdmin = App.currentUser?.role === 'faculty' || App.currentUser?.role === 'admin';

    tbody.innerHTML = students.map(st => `
      <tr>
        <td><strong>${st.register_number}</strong></td>
        <td>
          <div style="font-weight:600;">${st.full_name}</div>
          <div style="font-size:0.75rem; color:#94a3b8;">${st.email}</div>
        </td>
        <td>${st.department}</td>
        <td>Year ${st.year} • Sem ${st.semester}</td>
        <td>
          <div style="font-weight:600; color: ${st.latest_attendance >= 75 ? '#34d399' : '#f87171'}">
            ${st.latest_attendance ? st.latest_attendance + '%' : 'Pending'}
          </div>
        </td>
        <td>
          <span style="font-weight:700;">${st.latest_score ? st.latest_score + '%' : 'N/A'}</span>
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-secondary btn-sm" title="View Profile" onclick="Module1.viewStudentProfile(${st.id})">
              <i class="fas fa-id-card"></i>
            </button>
            <button class="btn btn-primary btn-sm" title="Academic Records" onclick="Module1.openAcademicRecordsModal(${st.id})">
              <i class="fas fa-book-open"></i> Records
            </button>
            <button class="btn btn-cyan btn-sm" title="AI Predict" onclick="Module2.predictStudent(${st.id})">
              <i class="fas fa-brain"></i> AI
            </button>
            ${isAdmin ? `
              <button class="btn btn-danger btn-sm" title="Delete" onclick="Module1.confirmDeleteStudent(${st.id}, '${st.full_name}')">
                <i class="fas fa-trash"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  },

  async viewStudentProfile(studentId) {
    try {
      const res = await fetch(`/api/students/${studentId}`);
      const data = await res.json();
      if (data.success && data.student) {
        const s = data.student;
        document.getElementById('profileRegNo').innerText = s.register_number;
        document.getElementById('profileFullName').innerText = s.full_name;
        document.getElementById('profileEmail').innerText = s.email;
        document.getElementById('profileDept').innerText = s.department;
        document.getElementById('profileYearSem').innerText = `Year ${s.year} / Semester ${s.semester}`;
        document.getElementById('profilePhone').innerText = s.contact_number || 'Not provided';

        // Render records history table inside modal
        const recBody = document.getElementById('profileRecordsBody');
        if (s.academic_records && s.academic_records.length > 0) {
          recBody.innerHTML = s.academic_records.map(r => `
            <tr>
              <td><strong>Sem ${r.semester}</strong></td>
              <td>${r.attendance_pct}%</td>
              <td>${r.assignment_score}%</td>
              <td>${r.internal_score}%</td>
              <td>${r.previous_sem_score}%</td>
              <td><strong>${r.calculated_avg}%</strong></td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="Module1.editRecord(${r.id})">Edit</button>
              </td>
            </tr>
          `).join('');
        } else {
          recBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#94a3b8;">No academic records logged yet.</td></tr>`;
        }

        // Set action for AI predict button on profile
        document.getElementById('btnProfilePredict').onclick = () => {
          App.closeModal('studentProfileModal');
          Module2.predictStudent(s.id);
        };

        App.openModal('studentProfileModal');
      }
    } catch (err) {
      App.showToast('Failed to load profile details', 'error');
    }
  },

  openAddStudentModal() {
    document.getElementById('formAddStudent').reset();
    App.openModal('addStudentModal');
  },

  async handleAddStudentSubmit(e) {
    e.preventDefault();
    const payload = {
      register_number: document.getElementById('newRegNo').value.trim(),
      full_name: document.getElementById('newFullName').value.trim(),
      email: document.getElementById('newEmail').value.trim(),
      department: document.getElementById('newDept').value,
      year: parseInt(document.getElementById('newYear').value),
      semester: parseInt(document.getElementById('newSem').value),
      contact_number: document.getElementById('newPhone').value.trim()
    };

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        App.showToast('Student registered successfully!', 'success');
        App.closeModal('addStudentModal');
        this.loadStudentsList();
        this.loadDashboardStats();
      } else {
        App.showToast(data.error || 'Failed to add student', 'error');
      }
    } catch (err) {
      App.showToast('Server error creating student', 'error');
    }
  },

  async openAcademicRecordsModal(studentId) {
    this.currentStudentId = studentId;
    try {
      const res = await fetch(`/api/students/${studentId}`);
      const data = await res.json();
      if (data.success && data.student) {
        const s = data.student;
        document.getElementById('recModalStudentName').innerText = `${s.full_name} (${s.register_number})`;
        document.getElementById('recStudentId').value = s.id;
        document.getElementById('recRegNo').value = s.register_number;
        document.getElementById('recDept').value = s.department;
        document.getElementById('recYear').value = s.year;
        document.getElementById('recSemester').value = s.semester;

        // Reset form & subjects
        document.getElementById('recAttendance').value = 85;
        document.getElementById('recAssignment').value = 80;
        document.getElementById('recInternals').value = 78;
        document.getElementById('recPrevSem').value = 75;
        document.getElementById('recNotes').value = '';

        // If latest record exists, populate default values
        if (s.academic_records && s.academic_records.length > 0) {
          const latest = s.academic_records[s.academic_records.length - 1];
          document.getElementById('recSemester').value = latest.semester;
          document.getElementById('recAttendance').value = latest.attendance_pct;
          document.getElementById('recAssignment').value = latest.assignment_score;
          document.getElementById('recInternals').value = latest.internal_score;
          document.getElementById('recPrevSem').value = latest.previous_sem_score;
          document.getElementById('recNotes').value = latest.notes || '';
          this.renderSubjectRows(latest.subject_marks || []);
        } else {
          this.renderDefaultSubjectRows();
        }

        App.openModal('academicRecordModal');
      }
    } catch (err) {
      App.showToast('Failed to open academic records modal', 'error');
    }
  },

  renderDefaultSubjectRows() {
    const defaultSubs = [
      { subject_name: 'Core Theory Subject 1', marks_obtained: 80, max_marks: 100 },
      { subject_name: 'Core Theory Subject 2', marks_obtained: 75, max_marks: 100 },
      { subject_name: 'Elective / Lab Subject', marks_obtained: 85, max_marks: 100 }
    ];
    this.renderSubjectRows(defaultSubs);
  },

  renderSubjectRows(subjects) {
    const container = document.getElementById('subjectMarksList');
    container.innerHTML = '';

    subjects.forEach((sub, idx) => {
      this.addSubjectRow(sub.subject_name, sub.marks_obtained, sub.max_marks);
    });
  },

  addSubjectRow(name = '', marks = 75, max = 100) {
    const container = document.getElementById('subjectMarksList');
    const row = document.createElement('div');
    row.className = 'subject-row';
    row.innerHTML = `
      <input type="text" class="form-input sub-name" placeholder="Subject Name" value="${name}" required />
      <input type="number" class="form-input sub-obt" placeholder="Marks" value="${marks}" min="0" max="100" required />
      <input type="number" class="form-input sub-max" placeholder="Max" value="${max}" min="1" max="100" required />
      <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()" style="padding: 8px;">
        <i class="fas fa-times"></i>
      </button>
    `;
    container.appendChild(row);
  },

  async handleSaveAcademicRecord(e) {
    e.preventDefault();
    
    // Gather subject rows
    const subjectRows = document.querySelectorAll('#subjectMarksList .subject-row');
    const subjectMarks = [];
    subjectRows.forEach(row => {
      const name = row.querySelector('.sub-name').value.trim();
      const obt = parseFloat(row.querySelector('.sub-obt').value) || 0;
      const max = parseFloat(row.querySelector('.sub-max').value) || 100;
      if (name) {
        subjectMarks.push({ subject_name: name, marks_obtained: obt, max_marks: max });
      }
    });

    const payload = {
      student_id: parseInt(document.getElementById('recStudentId').value),
      register_number: document.getElementById('recRegNo').value,
      department: document.getElementById('recDept').value,
      year: parseInt(document.getElementById('recYear').value),
      semester: parseInt(document.getElementById('recSemester').value),
      attendance_pct: parseFloat(document.getElementById('recAttendance').value),
      assignment_score: parseFloat(document.getElementById('recAssignment').value),
      internal_score: parseFloat(document.getElementById('recInternals').value),
      previous_sem_score: parseFloat(document.getElementById('recPrevSem').value),
      notes: document.getElementById('recNotes').value,
      subject_marks: subjectMarks
    };

    try {
      const res = await fetch('/api/academic-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        App.showToast('Academic record saved successfully!', 'success');
        App.closeModal('academicRecordModal');
        this.loadStudentsList();
        this.loadDashboardStats();
      } else {
        App.showToast(data.error || 'Failed to save record', 'error');
      }
    } catch (err) {
      App.showToast('Error saving academic record', 'error');
    }
  },

  async confirmDeleteStudent(studentId, name) {
    if (confirm(`Are you sure you want to delete student "${name}" and all their academic records?`)) {
      try {
        const res = await fetch(`/api/students/${studentId}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          App.showToast('Student deleted successfully', 'success');
          this.loadStudentsList();
          this.loadDashboardStats();
        } else {
          App.showToast(data.error || 'Failed to delete student', 'error');
        }
      } catch (err) {
        App.showToast('Error deleting student', 'error');
      }
    }
  }
};
