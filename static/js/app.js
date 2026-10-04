/**
 * Core Application Controller
 * Handles auth state, routing, global toast alerts, and modal system.
 */
const App = {
  currentUser: null,
  activeTab: 'dashboard',

  async init() {
    this.bindEvents();
    await this.checkAuth();
  },

  bindEvents() {
    // Nav links
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.dataset.tab;
        if (tab) {
          this.switchTab(tab);
        }
      });
    });

    // Mobile sidebar toggle
    const toggleBtn = document.getElementById('sidebarToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('open');
      });
    }
  },

  async checkAuth() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        this.currentUser = data.user;
        this.renderUserSession();
        this.switchTab('dashboard');
      } else {
        this.currentUser = null;
        this.renderAuthView();
      }
    } catch (err) {
      console.error('Auth verification error:', err);
      this.renderAuthView();
    }
  },

  renderUserSession() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('appMainContainer').style.display = 'flex';

    // Update user widget in sidebar
    document.getElementById('sidebarUserName').innerText = this.currentUser.full_name;
    const roleBadge = document.getElementById('sidebarUserRole');
    roleBadge.innerText = this.currentUser.role;
    roleBadge.className = `user-role-badge role-${this.currentUser.role}`;

    const avatar = document.getElementById('sidebarUserAvatar');
    avatar.innerText = this.currentUser.full_name.charAt(0).toUpperCase();

    // Adjust visibility based on role
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
      el.style.display = (this.currentUser.role === 'faculty' || this.currentUser.role === 'admin') ? '' : 'none';
    });

    // Refresh dashboard stats
    if (typeof Module1 !== 'undefined') {
      Module1.loadDashboardStats();
    }
  },

  renderAuthView() {
    document.getElementById('authContainer').style.display = 'block';
    document.getElementById('appMainContainer').style.display = 'none';
  },

  switchTab(tabName) {
    this.activeTab = tabName;

    // Update nav active classes
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.dataset.tab === tabName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Show active view section
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.style.display = 'none';
    });

    const targetSection = document.getElementById(`view-${tabName}`);
    if (targetSection) {
      targetSection.style.display = 'block';
    }

    // Tab-specific initializations
    if (tabName === 'dashboard') {
      if (typeof Module1 !== 'undefined') Module1.loadDashboardStats();
    } else if (tabName === 'students') {
      if (typeof Module1 !== 'undefined') Module1.loadStudentsList();
    } else if (tabName === 'predict') {
      if (typeof Module2 !== 'undefined') Module2.initPredictView();
    } else if (tabName === 'simulator') {
      if (typeof Module2 !== 'undefined') Module2.initSimulator();
    } else if (tabName === 'suggestions') {
      if (typeof Module3 !== 'undefined') Module3.initSuggestionsView();
    } else if (tabName === 'reports') {
      if (typeof Module4 !== 'undefined') Module4.initReportsView();
    }

    // Close mobile sidebar if open
    document.querySelector('.sidebar').classList.remove('open');
  },

  async login(email, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        this.showToast(data.message, 'success');
        this.currentUser = data.user;
        this.renderUserSession();
        this.switchTab('dashboard');
      } else {
        this.showToast(data.error || 'Login failed', 'error');
      }
    } catch (err) {
      this.showToast('Network error during login', 'error');
    }
  },

  async register(formData) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        this.showToast('Registration successful! Welcome.', 'success');
        this.currentUser = data.user;
        this.renderUserSession();
        this.switchTab('dashboard');
      } else {
        this.showToast(data.error || 'Registration failed', 'error');
      }
    } catch (err) {
      this.showToast('Network error during registration', 'error');
    }
  },

  async logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      this.currentUser = null;
      this.showToast('Logged out successfully', 'info');
      this.renderAuthView();
    } catch (err) {
      console.error(err);
    }
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-triangle';

    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
