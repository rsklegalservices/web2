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
  const navLocationsLink = document.getElementById('nav-locations') || document.getElementById('nav-contact');

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

  // Smooth scroll to target section if hash link
  if (navLocationsLink) {
    navLocationsLink.addEventListener('click', (e) => {
      const targetHash = navLocationsLink.getAttribute('href');
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
  // Mobile Sticky Header Scroll Appearance
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    const updateHeaderScroll = () => {
      if (window.scrollY > 10) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    };
    updateHeaderScroll();
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateHeaderScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // Mobile Navigation Drawer Controller (Mobile & Tablet <= 900px)
  // --------------------------------------------------------------------------
  function setupMobileNav() {
    const header = document.getElementById('site-header') || document.querySelector('.site-header');
    if (!header) return;

    const headerInner = header.querySelector('.header-inner');
    const mainNav = header.querySelector('.main-nav');
    if (!headerInner || !mainNav) return;

    // Avoid duplicate creation
    if (document.getElementById('mobile-nav-toggle')) return;

    // Determine home link URL based on current page
    const homeNavLink = mainNav.querySelector('a[href="/"], a[href="./"], a[href="../index.html"], a[href="index.html"]');
    const homeHref = homeNavLink ? homeNavLink.getAttribute('href') : '/';

    // 1. Mobile Header Brand (Title + Subtitle) on the left
    const mobileBrand = document.createElement('a');
    mobileBrand.className = 'mobile-header-brand';
    mobileBrand.href = homeHref;
    mobileBrand.setAttribute('aria-label', 'PR Sudheer Kumar & Co Home');
    mobileBrand.innerHTML = `
      <span class="mobile-header-title">PR Sudheer Kumar & Co</span>
      <span class="mobile-header-subtitle">Advocates & Legal Advisors</span>
    `;

    // 2. Mobile Nav Toggle (Hamburger Button) on the right
    const navToggle = document.createElement('button');
    navToggle.className = 'mobile-nav-toggle';
    navToggle.id = 'mobile-nav-toggle';
    navToggle.type = 'button';
    navToggle.setAttribute('aria-label', 'Open navigation menu');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.innerHTML = `
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    `;

    // Prepend brand and append hamburger toggle to header-inner
    headerInner.insertBefore(mobileBrand, headerInner.firstChild);
    headerInner.appendChild(navToggle);

    // 3. Mobile Backdrop Overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    overlay.id = 'mobile-nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    // 4. Mobile Drawer Panel
    const drawer = document.createElement('aside');
    drawer.className = 'mobile-nav-drawer';
    drawer.id = 'mobile-nav-drawer';
    drawer.setAttribute('aria-label', 'Mobile Navigation Drawer');

    // Drawer Header with Brand & Close Button ('×')
    const drawerHeader = document.createElement('div');
    drawerHeader.className = 'mobile-drawer-header';
    drawerHeader.innerHTML = `
      <div class="mobile-drawer-brand">
        <span class="mobile-drawer-title">PR & Co</span>
        <span class="mobile-drawer-subtitle">Law Offices</span>
      </div>
      <button class="mobile-drawer-close" id="mobile-drawer-close" type="button" aria-label="Close navigation menu">&times;</button>
    `;
    drawer.appendChild(drawerHeader);

    // Drawer Navigation List (Cloning links from .main-nav to preserve exact links & active state)
    const drawerNav = document.createElement('nav');
    drawerNav.className = 'mobile-drawer-nav';
    drawerNav.setAttribute('aria-label', 'Mobile Navigation');

    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      const drawerLink = document.createElement('a');
      drawerLink.href = link.getAttribute('href');
      drawerLink.textContent = link.textContent.trim();
      drawerLink.className = 'mobile-drawer-link' + (link.classList.contains('active') ? ' active' : '');
      if (link.hasAttribute('aria-current')) {
        drawerLink.setAttribute('aria-current', link.getAttribute('aria-current'));
      }
      drawerNav.appendChild(drawerLink);
    });
    drawer.appendChild(drawerNav);

    // Drawer Footer with Direct Contact Information
    const drawerFooter = document.createElement('div');
    drawerFooter.className = 'mobile-drawer-footer';
    drawerFooter.innerHTML = `
      <a href="tel:+919152888999" class="mobile-drawer-contact-item">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <span>+91 91 52 888 999</span>
      </a>
      <a href="mailto:rsklegalservices@gmail.com" class="mobile-drawer-contact-item">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        <span>rsklegalservices@gmail.com</span>
      </a>
      <a href="https://wa.me/919152888999?text=Hello%20PR%20Sudheer%20Kumar%20%26%20Co%2C%20I%20would%20like%20to%20inquire%20about%20legal%20services." target="_blank" rel="noopener noreferrer" class="mobile-drawer-whatsapp">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.17 8.17 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24z"/></svg>
        <span>Chat on WhatsApp</span>
      </a>
    `;
    drawer.appendChild(drawerFooter);

    document.body.appendChild(drawer);

    // Open & Close Handlers
    const closeBtn = document.getElementById('mobile-drawer-close');

    function openDrawer() {
      drawer.classList.add('is-active');
      overlay.classList.add('is-active');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('is-active');
      overlay.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (drawer.classList.contains('is-active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDrawer();
      });
    }

    overlay.addEventListener('click', () => {
      closeDrawer();
    });

    // Close on link click inside drawer
    drawer.querySelectorAll('.mobile-drawer-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        closeDrawer();
        if (href && href.startsWith('#')) {
          const targetElem = document.querySelector(href);
          if (targetElem) {
            e.preventDefault();
            setTimeout(() => {
              targetElem.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-active')) {
        closeDrawer();
      }
    });

    // Handle screen resize across the 900px breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && drawer.classList.contains('is-active')) {
        closeDrawer();
      }
    });
  }

  setupMobileNav();

  // --------------------------------------------------------------------------
  // Footer Ambient Sparkle / Particle Canvas
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('footer-particle-canvas');
  
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationId = null;
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
  }
});
