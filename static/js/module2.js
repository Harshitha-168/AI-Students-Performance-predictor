/**
 * Module 2: AI Performance Prediction & Simulator Controller
 * Implements ML score inference visualization, explainable AI factor breakdown,
 * interactive Chart.js radar & bar metrics, and What-If simulator.
 */
const Module2 = {
  radarChartInstance: null,
  subjectChartInstance: null,
  cohortChartInstance: null,
  currentPrediction: null,

  async initPredictView() {
    // If student, auto-predict for current student
    if (App.currentUser?.role === 'student' && App.currentUser?.student_id) {
      this.predictStudent(App.currentUser.student_id);
    } else {
      // Faculty view: load batch predictions table & select first student
      this.loadBatchPredictions();
    }
  },

  async predictStudent(studentId) {
    App.switchTab('predict');
    document.getElementById('predictLoadingOverlay').style.display = 'flex';

    try {
      const res = await fetch(`/api/predict/student/${studentId}`);
      const data = await res.json();
      if (data.success && data.prediction) {
        this.currentPrediction = data.prediction;
        this.renderPredictionResult(data.prediction);
      } else {
        App.showToast(data.error || 'Failed to generate prediction', 'error');
      }
    } catch (err) {
      App.showToast('Server error generating prediction', 'error');
    } finally {
      document.getElementById('predictLoadingOverlay').style.display = 'none';
    }
  },

  renderPredictionResult(pred) {
    const student = pred.student;
    const rec = pred.academic_record;

    // Student identity header
    document.getElementById('predStudentTitle').innerText = `${student.full_name} (${student.register_number})`;
    document.getElementById('predStudentMeta').innerText = `${student.department} • Year ${student.year} • Semester ${student.semester}`;

    // Risk badge
    const riskBadge = document.getElementById('predRiskBadge');
    riskBadge.innerText = pred.risk_level;
    riskBadge.className = `badge badge-${pred.risk_code}-risk`;

    // Tier badge
    const tierBadge = document.getElementById('predTierBadge');
    tierBadge.innerText = `${pred.performance_tier} Performance (${pred.tier_badge})`;
    tierBadge.className = `badge badge-${pred.performance_tier.toLowerCase()}-tier`;

    // Confidence badge
    document.getElementById('predConfidenceText').innerText = `${pred.confidence_score}% Confidence`;

    // Animate 3D score gauge
    if (typeof UI3D !== 'undefined') {
      UI3D.animateScoreCircle(pred.predicted_percentage, pred.risk_code);
    }

    // Render Key Factors list
    this.renderKeyFactors(pred.key_factors);

    // Render Radar and Subject charts
    this.renderRadarChart(pred.radar_metrics);
    this.renderSubjectChart(rec.subject_marks || []);
  },

  renderKeyFactors(factors) {
    const container = document.getElementById('predictionFactorsList');
    if (!container) return;

    if (!factors || factors.length === 0) {
      container.innerHTML = `<div style="color:#94a3b8; font-size:0.85rem;">No critical anomaly factors detected. Performance is consistent.</div>`;
      return;
    }

    container.innerHTML = factors.map(f => `
      <div class="factor-item ${f.type}">
        <div class="factor-icon">
          <i class="fas ${f.type === 'positive' ? 'fa-arrow-trend-up' : 'fa-triangle-exclamation'}"></i>
        </div>
        <div style="flex:1;">
          <div class="factor-title">
            <span>${f.factor}</span>
            <span class="factor-val">${f.value}</span>
            <span style="font-size:0.75rem; color:${f.type === 'positive' ? '#10b981' : '#ef4444'}; margin-left:auto;">
              ${f.impact} Impact (${f.weight}% weight)
            </span>
          </div>
          <div class="factor-desc">${f.description}</div>
        </div>
      </div>
    `).join('');
  },

  renderRadarChart(metrics) {
    const canvas = document.getElementById('chartPredictionRadar');
    if (!canvas) return;

    if (this.radarChartInstance) {
      this.radarChartInstance.destroy();
    }

    const labels = Object.keys(metrics);
    const values = Object.values(metrics);

    const ctx = canvas.getContext('2d');
    this.radarChartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Student Metrics',
          data: values,
          backgroundColor: 'rgba(99, 102, 241, 0.25)',
          borderColor: '#6366f1',
          pointBackgroundColor: '#06b6d4',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#6366f1',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
            grid: { color: 'rgba(255, 255, 255, 0.08)' },
            pointLabels: { color: '#94a3b8', font: { size: 11, weight: '600' } },
            ticks: { display: false, min: 0, max: 100 }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  },

  renderSubjectChart(subjects) {
    const canvas = document.getElementById('chartSubjectMarksBar');
    if (!canvas) return;

    if (this.subjectChartInstance) {
      this.subjectChartInstance.destroy();
    }

    if (!subjects || subjects.length === 0) {
      subjects = [
        { subject_name: 'Core Sub 1', marks_obtained: 75, max_marks: 100 },
        { subject_name: 'Core Sub 2', marks_obtained: 70, max_marks: 100 },
        { subject_name: 'Core Sub 3', marks_obtained: 80, max_marks: 100 }
      ];
    }

    const labels = subjects.map(s => s.subject_name);
    const percentages = subjects.map(s => (s.marks_obtained / (s.max_marks || 100)) * 100);
    const colors = percentages.map(p => p >= 75 ? '#10b981' : p >= 50 ? '#6366f1' : '#ef4444');

    const ctx = canvas.getContext('2d');
    this.subjectChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Subject Marks %',
          data: percentages,
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
            ticks: { color: '#94a3b8', maxRotation: 25, minRotation: 0 }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  },

  async loadBatchPredictions() {
    try {
      const res = await fetch('/api/predict/batch');
      const data = await res.json();
      if (data.success) {
        this.renderBatchTable(data.records);
        this.renderCohortChart(data.summary);
      }
    } catch (err) {
      console.error(err);
    }
  },

  renderBatchTable(records) {
    const tbody = document.getElementById('batchPredictTableBody');
    if (!tbody) return;

    tbody.innerHTML = records.map(r => `
      <tr>
        <td><strong>${r.register_number}</strong></td>
        <td>${r.full_name}</td>
        <td>${r.department}</td>
        <td>${r.attendance}%</td>
        <td><strong style="font-size:1.05rem; color:#fff;">${r.predicted_percentage}%</strong></td>
        <td>
          <span class="badge badge-${r.risk_code}-risk">${r.risk_level}</span>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="Module2.predictStudent(${r.student_id})">
            <i class="fas fa-chart-line"></i> Deep Dive
          </button>
        </td>
      </tr>
    `).join('');
  },

  renderCohortChart(summary) {
    const canvas = document.getElementById('chartCohortSummary');
    if (!canvas || !summary) return;

    if (this.cohortChartInstance) {
      this.cohortChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    this.cohortChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['High (>=75%)', 'Medium (50-74%)', 'Low (<50%)', 'Critical Risk (<45%)'],
        datasets: [{
          data: [summary.high_performance, summary.medium_performance, summary.low_performance, summary.critical_risk],
          backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 10, font: { size: 10 } } }
        },
        cutout: '65%'
      }
    });
  },

  /* --- Interactive What-If Simulator --- */
  initSimulator() {
    this.bindSimulatorSliders();
    this.runLiveSimulation();
  },

  bindSimulatorSliders() {
    const sliders = ['simAttendance', 'simAssignment', 'simInternals', 'simPrevSem'];
    sliders.forEach(id => {
      const slider = document.getElementById(id);
      const valLabel = document.getElementById(`${id}Val`);
      if (slider && valLabel) {
        slider.oninput = () => {
          valLabel.innerText = `${slider.value}%`;
          this.runLiveSimulation();
        };
      }
    });
  },

  async runLiveSimulation() {
    const payload = {
      attendance_pct: parseFloat(document.getElementById('simAttendance')?.value || 80),
      assignment_score: parseFloat(document.getElementById('simAssignment')?.value || 75),
      internal_score: parseFloat(document.getElementById('simInternals')?.value || 70),
      previous_sem_score: parseFloat(document.getElementById('simPrevSem')?.value || 70),
      subject_marks: []
    };

    try {
      const res = await fetch('/api/predict/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.simulation) {
        const sim = data.simulation;
        
        document.getElementById('simPredictedScore').innerText = `${sim.predicted_percentage}%`;
        
        const tierBadge = document.getElementById('simTierBadge');
        tierBadge.innerText = `${sim.performance_tier} Performance (${sim.tier_badge})`;
        tierBadge.className = `badge badge-${sim.performance_tier.toLowerCase()}-tier`;

        const riskBadge = document.getElementById('simRiskBadge');
        riskBadge.innerText = sim.risk_level;
        riskBadge.className = `badge badge-${sim.risk_code}-risk`;

        // Update factors preview
        const factorBox = document.getElementById('simFactorsPreview');
        if (factorBox && sim.key_factors) {
          factorBox.innerHTML = sim.key_factors.map(f => `
            <div style="font-size:0.8rem; margin-bottom:6px; display:flex; align-items:center; gap:6px; color: ${f.type === 'positive' ? '#34d399' : '#f87171'};">
              <i class="fas ${f.type === 'positive' ? 'fa-check' : 'fa-exclamation-circle'}"></i>
              <span><strong>${f.factor}:</strong> ${f.description}</span>
            </div>
          `).join('');
        }
      }
    } catch (err) {
      console.error('Simulation error:', err);
    }
  }
};
