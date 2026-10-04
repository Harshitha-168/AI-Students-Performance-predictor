/**
 * Module 3: Personalized Improvement Suggestions Controller
 * Displays AI-generated weak subject remediation plans, attendance recovery targets,
 * actionable study roadmaps, and priority-coded intervention cards.
 */
const Module3 = {
  currentSuggestions: null,

  async initSuggestionsView() {
    // If student, load their own suggestions
    if (App.currentUser?.role === 'student' && App.currentUser?.student_id) {
      document.getElementById('sugStudentSelectWrapper').style.display = 'none';
      this.loadStudentSuggestions(App.currentUser.student_id);
    } else {
      // Faculty view: show student dropdown & load cohort priority overview
      document.getElementById('sugStudentSelectWrapper').style.display = 'flex';
      this.populateStudentDropdown();
      this.loadCohortSuggestionsSummary();
    }
  },

  async populateStudentDropdown() {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.success && data.students) {
        const select = document.getElementById('sugStudentSelect');
        if (!select) return;

        select.innerHTML = data.students.map(st => `
          <option value="${st.id}">${st.register_number} - ${st.full_name} (${st.department})</option>
        `).join('');

        if (data.students.length > 0) {
          select.value = data.students[0].id;
          this.loadStudentSuggestions(data.students[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  },

  async handleStudentSelectChange(studentId) {
    if (studentId) {
      this.loadStudentSuggestions(studentId);
    }
  },

  async loadStudentSuggestions(studentId) {
    document.getElementById('sugLoadingOverlay').style.display = 'flex';

    try {
      const res = await fetch(`/api/suggestions/student/${studentId}`);
      const data = await res.json();
      if (data.success && data.suggestions) {
        this.currentSuggestions = data.suggestions;
        this.renderSuggestions(data.suggestions);
      } else {
        App.showToast(data.error || 'Failed to load suggestions', 'error');
      }
    } catch (err) {
      App.showToast('Server error loading recommendations', 'error');
    } finally {
      document.getElementById('sugLoadingOverlay').style.display = 'none';
    }
  },

  renderSuggestions(sug) {
    const student = sug.student;
    const pred = sug.prediction;

    // Header Meta
    document.getElementById('sugStudentTitle').innerText = `${student.full_name} (${student.register_number})`;
    document.getElementById('sugStudentMeta').innerText = `${student.department} • Year ${student.year} • Semester ${student.semester} • Current Risk: ${pred.risk_level}`;

    // Target Score Forecast
    document.getElementById('sugCurrentScore').innerText = `${sug.current_predicted_score}%`;
    document.getElementById('sugTargetScore').innerText = `${sug.target_projected_score}%`;
    document.getElementById('sugPotentialGain').innerText = sug.total_potential_gain;

    // Priority Counts
    document.getElementById('sugCriticalCount').innerText = sug.critical_priority_count;
    document.getElementById('sugHighCount').innerText = sug.high_priority_count;
    document.getElementById('sugMediumCount').innerText = sug.medium_priority_count;

    // 1. Render Weak Subject Remediation Cards
    this.renderWeakSubjects(sug.weak_subjects);

    // 2. Render Attendance Recovery Card
    this.renderAttendanceRecovery(sug.attendance_recovery);

    // 3. Render General Recommendation Action Cards
    this.renderActionCards(sug.recommendations);
  },

  renderWeakSubjects(weakSubjects) {
    const container = document.getElementById('sugWeakSubjectsList');
    if (!container) return;

    if (!weakSubjects || weakSubjects.length === 0) {
      container.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); padding: 18px; border-radius: var(--radius-md); text-align: center;">
          <i class="fas fa-check-circle" style="color: var(--success); font-size: 1.5rem; margin-bottom: 8px;"></i>
          <div style="font-weight: 700; color: #34d399;">No Critical Weak Subjects Detected!</div>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">All subject marks are currently at or above course passing benchmarks.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = weakSubjects.map(ws => `
      <div class="card-3d" style="margin-bottom: 14px; border-left: 4px solid ${ws.priority_code === 'critical' ? '#ef4444' : '#f59e0b'};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h4 style="font-size: 1.05rem; font-weight: 700;">${ws.subject}</h4>
              <span class="badge ${ws.priority_code === 'critical' ? 'badge-critical-risk' : 'badge-moderate-risk'}">
                ${ws.priority} Priority
              </span>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
              Current Score: <strong style="color: #f87171;">${ws.current_score}%</strong> • Target: <strong style="color: #34d399;">${ws.target_score}%</strong>
            </div>
          </div>
          <div style="text-align: right;">
            <span class="badge badge-high-tier" style="font-size: 0.8rem;">Potential Gain ${ws.estimated_gain}</span>
            <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 4px;"><i class="fas fa-clock"></i> ${ws.weekly_study_hours} hrs/week recommended</div>
          </div>
        </div>

        <p style="font-size: 0.86rem; color: #e2e8f0; margin-bottom: 10px;">${ws.action_plan}</p>

        <div style="background: rgba(0, 0, 0, 0.25); padding: 10px 14px; border-radius: var(--radius-sm);">
          <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--accent-cyan); font-weight: 700; margin-bottom: 4px;">
            Target Focus Topics:
          </div>
          <ul style="padding-left: 18px; font-size: 0.82rem; color: var(--text-muted);">
            ${ws.focus_areas.map(fa => `<li style="margin-bottom: 2px;">${fa}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  },

  renderAttendanceRecovery(attRec) {
    const container = document.getElementById('sugAttendanceRecoveryBox');
    if (!container) return;

    if (!attRec) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    container.innerHTML = `
      <div class="card-3d holo-card" style="text-align: left; margin-bottom: 20px; border-color: ${attRec.priority_code === 'critical' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-calendar-check" style="color: ${attRec.priority_code === 'critical' ? '#ef4444' : '#f59e0b'}; font-size: 1.2rem;"></i>
            <h4 style="font-size: 1.05rem; font-weight: 700;">${attRec.title}</h4>
          </div>
          <span class="badge ${attRec.priority_code === 'critical' ? 'badge-critical-risk' : 'badge-moderate-risk'}">
            ${attRec.priority} Priority
          </span>
        </div>

        <p style="font-size: 0.88rem; color: #f8fafc; margin-bottom: 12px;">${attRec.description}</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 14px;">
          <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: var(--radius-sm);">
            <div style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase;">Current Attendance</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: ${attRec.current_attendance < 75 ? '#f87171' : '#fbbf24'};">${attRec.current_attendance}%</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: var(--radius-sm);">
            <div style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase;">Classes to Attend Consecutively</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--accent-cyan);">${attRec.classes_to_attend} Lectures</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: var(--radius-sm);">
            <div style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase;">Target Goal</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #34d399;">${attRec.target_attendance}% (Safe Tier)</div>
          </div>
        </div>

        <div style="font-size: 0.82rem; color: var(--text-muted);">
          <strong>Mandatory Action Steps:</strong>
          <ul style="padding-left: 18px; margin-top: 4px;">
            ${attRec.action_items.map(ai => `<li style="margin-bottom: 3px;">${ai}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  },

  renderActionCards(recs) {
    const container = document.getElementById('sugGeneralActionCards');
    if (!container) return;

    // Filter out attendance which is rendered in dedicated box
    const general = recs.filter(r => r.category !== 'Attendance Recovery' && r.category !== 'Attendance Optimization');

    if (general.length === 0) {
      container.innerHTML = `<div style="color: #94a3b8; font-size: 0.85rem;">No additional intervention items at this time.</div>`;
      return;
    }

    container.innerHTML = general.map(g => `
      <div class="card-3d" style="margin-bottom: 14px; border-left: 4px solid ${g.priority_code === 'critical' ? '#ef4444' : g.priority_code === 'high' ? '#fb923c' : g.priority_code === 'medium' ? '#fbbf24' : '#10b981'};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4 style="font-size: 0.95rem; font-weight: 700;">${g.title}</h4>
          <div style="display: flex; gap: 6px;">
            <span class="badge badge-high-tier" style="font-size: 0.75rem;">${g.estimated_gain}</span>
            <span class="badge ${g.priority_code === 'critical' ? 'badge-critical-risk' : g.priority_code === 'high' ? 'badge-high-risk' : g.priority_code === 'medium' ? 'badge-moderate-risk' : 'badge-low-risk'}">
              ${g.priority}
            </span>
          </div>
        </div>

        <p style="font-size: 0.84rem; color: var(--text-main); margin-bottom: 8px;">${g.description}</p>

        <ul style="padding-left: 18px; font-size: 0.8rem; color: var(--text-muted);">
          ${g.action_items.map(item => `<li style="margin-bottom: 2px;">${item}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  },

  async loadCohortSuggestionsSummary() {
    try {
      const res = await fetch('/api/suggestions/cohort-summary');
      const data = await res.json();
      if (data.success && data.summary) {
        const sum = data.summary;
        const box = document.getElementById('facultyCohortSuggestionsBox');
        if (box) box.style.display = 'block';

        const critList = document.getElementById('cohortCriticalStudentsList');
        if (critList) {
          if (sum.critical_priority_students.length === 0) {
            critList.innerHTML = `<div style="color:#94a3b8; font-size:0.85rem;">No critical priority interventions currently flagged.</div>`;
          } else {
            critList.innerHTML = sum.critical_priority_students.map(cs => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.04);">
                <div>
                  <strong>${cs.full_name}</strong> (${cs.register_number})
                  <div style="font-size:0.75rem; color:#94a3b8;">${cs.department} • ${cs.critical_count} critical action items</div>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="Module3.loadStudentSuggestions(${cs.student_id}); document.getElementById('sugStudentSelect').value = ${cs.student_id};">
                  View Plan
                </button>
              </div>
            `).join('');
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
};
