/**
 * Module 4: Performance Dashboard & Reports Controller
 * Implements multi-dimensional analytics, interactive Chart.js visualizations,
 * downloadable CSV exports, and official printable academic transcript reports.
 */
const Module4 = {
  attendanceChartInstance: null,
  progressionChartInstance: null,
  subjectAvgChartInstance: null,
  riskDoughnutChartInstance: null,
  currentAnalytics: null,

  async initReportsView() {
    this.loadAnalytics();
  },

  async loadAnalytics() {
    const dept = document.getElementById('reportFilterDept')?.value || '';
    const year = document.getElementById('reportFilterYear')?.value || '';
    const sem = document.getElementById('reportFilterSem')?.value || '';

    const url = `/api/reports/analytics?department=${encodeURIComponent(dept)}&year=${encodeURIComponent(year)}&semester=${encodeURIComponent(sem)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.analytics) {
        this.currentAnalytics = data.analytics;
        this.renderAnalytics(data.analytics);
      }
    } catch (err) {
      App.showToast('Failed to load performance analytics', 'error');
    }
  },

  renderAnalytics(data) {
    const sum = data.summary;

    // Overview KPIs
    document.getElementById('repTotalStudents').innerText = sum.total_students;
    document.getElementById('repAvgScore').innerText = `${sum.average_predicted_score}%`;
    document.getElementById('repAvgAttendance').innerText = `${sum.average_attendance}%`;
    document.getElementById('repPassRate').innerText = `${sum.forecast_pass_rate}%`;
    document.getElementById('repCriticalCount').innerText = sum.critical_risk_count;

    // Render 4 Charts
    this.renderAttendanceVsMarksChart(data.attendance_vs_marks);
    this.renderSemesterProgressionChart(data.semester_progression);
    this.renderSubjectAveragesChart(data.subject_averages);
    this.renderRiskDoughnutChart(data.risk_distribution);

    // Render Student Roster Table
    this.renderRosterTable(data.student_roster);
  },

  renderAttendanceVsMarksChart(scatterData) {
    const canvas = document.getElementById('chartAttendanceVsMarks');
    if (!canvas) return;

    if (this.attendanceChartInstance) {
      this.attendanceChartInstance.destroy();
    }

    const points = scatterData.map(d => ({
      x: d.attendance,
      y: d.predicted_score,
      label: `${d.name} (${d.reg_no})`,
      risk: d.risk
    }));

    const colors = scatterData.map(d => {
      if (d.risk === 'Low Risk') return '#10b981';
      if (d.risk === 'Moderate Risk') return '#fbbf24';
      if (d.risk === 'High Risk') return '#fb923c';
      return '#ef4444';
    });

    const ctx = canvas.getContext('2d');
    this.attendanceChartInstance = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Students',
          data: points,
          pointBackgroundColor: colors,
          pointBorderColor: '#fff',
          pointRadius: 6,
          pointHoverRadius: 9
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: 'Attendance Rate (%)', color: '#94a3b8' },
            min: 30,
            max: 100,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          },
          y: {
            title: { display: true, text: 'Predicted Final Score (%)', color: '#94a3b8' },
            min: 20,
            max: 100,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const pt = context.raw;
                return `${pt.label} | Attendance: ${pt.x}% | Score: ${pt.y}% (${pt.risk})`;
              }
            }
          }
        }
      }
    });
  },

  renderSemesterProgressionChart(progressionData) {
    const canvas = document.getElementById('chartSemesterProgression');
    if (!canvas) return;

    if (this.progressionChartInstance) {
      this.progressionChartInstance.destroy();
    }

    if (!progressionData || progressionData.length === 0) {
      progressionData = [
        { semester: 'Sem 1', avg_score: 72.5, avg_attendance: 84.0 },
        { semester: 'Sem 2', avg_score: 74.0, avg_attendance: 86.2 },
        { semester: 'Sem 3', avg_score: 71.8, avg_attendance: 82.5 },
        { semester: 'Sem 4', avg_score: 76.5, avg_attendance: 88.0 },
        { semester: 'Sem 5', avg_score: 78.2, avg_attendance: 89.4 }
      ];
    }

    const labels = progressionData.map(p => p.semester);
    const scoreData = progressionData.map(p => p.avg_score);
    const attendanceData = progressionData.map(p => p.avg_attendance);

    const ctx = canvas.getContext('2d');
    this.progressionChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Avg Score %',
            data: scoreData,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            tension: 0.35,
            fill: true,
            borderWidth: 2
          },
          {
            label: 'Avg Attendance %',
            data: attendanceData,
            borderColor: '#06b6d4',
            borderDash: [5, 5],
            tension: 0.35,
            fill: false,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 40,
            max: 100,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#94a3b8', boxWidth: 12, font: { size: 11 } }
          }
        }
      }
    });
  },

  renderSubjectAveragesChart(subjectData) {
    const canvas = document.getElementById('chartReportSubjectAverages');
    if (!canvas) return;

    if (this.subjectAvgChartInstance) {
      this.subjectAvgChartInstance.destroy();
    }

    const labels = subjectData.map(s => s.subject);
    const scores = subjectData.map(s => s.average_score);
    const colors = scores.map(s => s >= 75 ? '#10b981' : s >= 50 ? '#6366f1' : '#ef4444');

    const ctx = canvas.getContext('2d');
    this.subjectAvgChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cohort Average %',
          data: scores,
          backgroundColor: colors,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 100,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', maxRotation: 20 }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  },

  renderRiskDoughnutChart(riskDistribution) {
    const canvas = document.getElementById('chartReportRiskDoughnut');
    if (!canvas) return;

    if (this.riskDoughnutChartInstance) {
      this.riskDoughnutChartInstance.destroy();
    }

    const labels = ['Low Risk', 'Moderate Risk', 'High Risk', 'Critical Risk'];
    const dataVals = labels.map(k => riskDistribution[k] || 0);

    const ctx = canvas.getContext('2d');
    this.riskDoughnutChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataVals,
          backgroundColor: ['#10b981', '#fbbf24', '#fb923c', '#ef4444'],
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
            labels: { color: '#94a3b8', boxWidth: 12, padding: 10, font: { size: 10 } }
          }
        },
        cutout: '65%'
      }
    });
  },

  renderRosterTable(roster) {
    const tbody = document.getElementById('reportRosterTableBody');
    if (!tbody) return;

    tbody.innerHTML = roster.map(st => `
      <tr>
        <td><strong>${st.register_number}</strong></td>
        <td>${st.full_name}</td>
        <td>${st.department}</td>
        <td>Yr ${st.year} • Sem ${st.semester}</td>
        <td>${st.attendance}%</td>
        <td>${st.internals}%</td>
        <td><strong>${st.predicted_score}%</strong></td>
        <td>
          <span class="badge ${st.risk_level === 'Low Risk' ? 'badge-low-risk' : st.risk_level === 'Moderate Risk' ? 'badge-moderate-risk' : st.risk_level === 'High Risk' ? 'badge-high-risk' : 'badge-critical-risk'}">
            ${st.risk_level}
          </span>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="Module4.openTranscriptModal(${st.student_id})">
            <i class="fas fa-file-lines"></i> Transcript
          </button>
        </td>
      </tr>
    `).join('');
  },

  exportCSV() {
    const dept = document.getElementById('reportFilterDept')?.value || '';
    const year = document.getElementById('reportFilterYear')?.value || '';
    const sem = document.getElementById('reportFilterSem')?.value || '';

    window.location.href = `/api/reports/export-csv?department=${encodeURIComponent(dept)}&year=${encodeURIComponent(year)}&semester=${encodeURIComponent(sem)}`;
  },

  async openTranscriptModal(studentId) {
    try {
      const res = await fetch(`/api/reports/transcript/${studentId}`);
      const data = await res.json();
      if (data.success && data.transcript) {
        this.renderTranscriptContent(data.transcript);
        App.openModal('transcriptReportModal');
      } else {
        App.showToast('Failed to load transcript data', 'error');
      }
    } catch (err) {
      App.showToast('Server error generating transcript', 'error');
    }
  },

  renderTranscriptContent(t) {
    const st = t.student;
    const pred = t.prediction;
    const sug = t.suggestions;

    document.getElementById('transStudentName').innerText = st.full_name;
    document.getElementById('transRegNo').innerText = st.register_number;
    document.getElementById('transDept').innerText = st.department;
    document.getElementById('transYearSem').innerText = `Year ${st.year} / Semester ${st.semester}`;
    document.getElementById('transEmail').innerText = st.email;

    // Predicted Metrics
    document.getElementById('transPredScore').innerText = `${pred.predicted_percentage}%`;
    document.getElementById('transPredTier').innerText = `${pred.performance_tier} Performance (${pred.tier_badge})`;
    document.getElementById('transRiskLevel').innerText = pred.risk_level;
    document.getElementById('transConfidence').innerText = `${pred.confidence_score}% Confidence`;

    // Semester Academic Records Table
    const recBody = document.getElementById('transRecordsTableBody');
    if (t.academic_records && t.academic_records.length > 0) {
      recBody.innerHTML = t.academic_records.map(r => `
        <tr>
          <td><strong>Semester ${r.semester}</strong></td>
          <td>${r.attendance_pct}%</td>
          <td>${r.assignment_score}%</td>
          <td>${r.internal_score}%</td>
          <td>${r.previous_sem_score}%</td>
          <td><strong>${r.calculated_avg}%</strong></td>
        </tr>
      `).join('');
    } else {
      recBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No records available.</td></tr>`;
    }

    // Weak Subject Remediation Points
    const sugList = document.getElementById('transSuggestionsList');
    if (sug && sug.weak_subjects && sug.weak_subjects.length > 0) {
      sugList.innerHTML = sug.weak_subjects.map(ws => `
        <li style="margin-bottom: 6px;">
          <strong>${ws.subject} (${ws.current_score}%):</strong> ${ws.action_plan} (Target: ${ws.target_score}%)
        </li>
      `).join('');
    } else {
      sugList.innerHTML = `<li>Performance is consistent across all registered subjects. Maintain current study routine.</li>`;
    }
  },

  printTranscript() {
    window.print();
  }
};
