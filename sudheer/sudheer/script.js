/**
 * PR Sudheer Kumar & Co - Interactive Features & Ambient Particle Canvas
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // Modals Controller
  // --------------------------------------------------------------------------
  const practiceModal = document.getElementById('practice-modal');
  const aboutModal = document.getElementById('about-modal');

  const openPracticeBtn = document.getElementById('open-practice-modal');
  const navServicesLink = document.getElementById('nav-services');
  const navAboutLink = document.getElementById('nav-about');
  const navContactLink = document.getElementById('nav-contact');

  const closePracticeBtn = document.getElementById('close-practice-modal');
  const closeAboutBtn = document.getElementById('close-about-modal');
  const practiceBackdrop = document.getElementById('practice-modal-backdrop');
  const aboutBackdrop = document.getElementById('about-modal-backdrop');

  function openModal(modal) {
    if (!modal) return;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // Open Practice Areas Modal (if button exists and practice modal exists)
  if (openPracticeBtn && practiceModal) {
    // Navigates or opens modal if on home
    // The user prefers navigating to services.html, so link handles it directly
  }

  // Navigation links for Services and About navigate directly to their dedicated pages (services.html and about.html)

  // Smooth scroll to contact / target section
  if (navContactLink) {
    navContactLink.addEventListener('click', (e) => {
      const targetHash = navContactLink.getAttribute('href');
      if (targetHash && targetHash.startsWith('#')) {
        const targetElem = document.querySelector(targetHash);
        if (targetElem) {
          e.preventDefault();
          targetElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // Close handlers
  if (closePracticeBtn) closePracticeBtn.addEventListener('click', () => closeModal(practiceModal));
  if (practiceBackdrop) practiceBackdrop.addEventListener('click', () => closeModal(practiceModal));

  if (closeAboutBtn) closeAboutBtn.addEventListener('click', () => closeModal(aboutModal));
  if (aboutBackdrop) aboutBackdrop.addEventListener('click', () => closeModal(aboutModal));

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(practiceModal);
      closeModal(aboutModal);
    }
  });

  // --------------------------------------------------------------------------
  // Footer Ambient Sparkle / Particle Canvas
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('footer-particle-canvas');
  const pauseBtn = document.getElementById('pause-animation-toggle');
  
  if (canvas && pauseBtn) {
    const ctx = canvas.getContext('2d');
    let animationId = null;
    let isPaused = false;
    let particles = [];
    const particleCount = 45;

    function resizeCanvas() {
      const footer = document.getElementById('footer-section');
      if (!footer) return;
      canvas.width = footer.clientWidth;
      canvas.height = footer.clientHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.2 + 0.8;
        this.baseAlpha = Math.random() * 0.45 + 0.2;
        this.alpha = this.baseAlpha;
        this.speedY = -(Math.random() * 0.35 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleOffset = Math.random() * Math.PI * 2;
      }

      update() {
        if (isPaused) return;
        this.y += this.speedY;
        this.x += this.speedX;
        this.twinkleOffset += this.twinkleSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.twinkleOffset) * 0.2;

        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
          this.y = canvas.height + 5;
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, this.alpha))})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
      }
    }

    function initParticles() {
      resizeCanvas();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    initParticles();
    animate();

    // Toggle Pause / Play Button (Matching the screenshot icon)
    const pauseIcon = pauseBtn.querySelector('.pause-icon');
    const playIcon = pauseBtn.querySelector('.play-icon');

    pauseBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      if (isPaused) {
        pauseIcon.style.display = 'none';
        playIcon.style.display = 'inline-flex';
        pauseBtn.setAttribute('aria-label', 'Play background animation');
        pauseBtn.setAttribute('title', 'Play animation');
      } else {
        pauseIcon.style.display = 'inline-flex';
        playIcon.style.display = 'none';
        pauseBtn.setAttribute('aria-label', 'Pause background animation');
        pauseBtn.setAttribute('title', 'Pause animation');
      }
    });
  }
});
