/**
 * UI 3D Interactive Controller
 * Handles 3D tilt perspective on cards, gauge animations, and parallax micro-interactions.
 */
const UI3D = {
  init() {
    this.attachTiltEffects();
    this.attachObserver();
  },

  attachTiltEffects() {
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.card-3d, .holo-card');
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        // Check if mouse is near or inside card
        if (
          mouseX >= rect.left - 40 &&
          mouseX <= rect.right + 40 &&
          mouseY >= rect.top - 40 &&
          mouseY <= rect.bottom + 40
        ) {
          const cardCenterX = rect.left + rect.width / 2;
          const cardCenterY = rect.top + rect.height / 2;

          const deltaX = (mouseX - cardCenterX) / (rect.width / 2);
          const deltaY = (mouseY - cardCenterY) / (rect.height / 2);

          const tiltX = -deltaY * 6; // Max 6 deg
          const tiltY = deltaX * 6;

          card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
        } else {
          card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        }
      });
    });
  },

  animateScoreCircle(percent, riskCode) {
    const circle = document.getElementById('predictionProgressCircle');
    const scoreText = document.getElementById('predictionScoreValue');
    if (!circle || !scoreText) return;

    const radius = 68;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;

    // Color based on risk code
    let strokeColor = '#10b981'; // Green
    if (riskCode === 'moderate') strokeColor = '#f59e0b'; // Amber
    else if (riskCode === 'high') strokeColor = '#fb923c'; // Orange
    else if (riskCode === 'critical') strokeColor = '#ef4444'; // Red

    circle.style.stroke = strokeColor;

    // Calculate offset
    const offset = circumference - (percent / 100) * circumference;
    
    // Trigger animation
    setTimeout(() => {
      circle.style.strokeDashoffset = offset;
    }, 50);

    // Number roll up animation
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    function updateNumber(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = (easeProgress * percent).toFixed(1);
      scoreText.innerText = `${current}%`;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        scoreText.innerText = `${percent}%`;
      }
    }
    requestAnimationFrame(updateNumber);
  },

  attachObserver() {
    // Reveal animations on element visibility
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card-3d').forEach(el => observer.observe(el));
  }
};

document.addEventListener('DOMContentLoaded', () => {
  UI3D.init();
});
