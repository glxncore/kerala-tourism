/**
 * THΛNAL (തണൽ) — MAIN APPLICATION SCRIPT
 * Coordinates navigation, sticky header states, mood filters, smooth scroll,
 * and the immersive Kerala destination slideshow.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMoodFilters();
  initSmoothScroll();
  initDestinationSlideshow();
});

/* --------------------------------------------------------------------------
   1. NAVIGATION & STICKY HEADER
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const navMenu = document.querySelector('.nav-menu');

  // Sticky header blur effect on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. IMMERSIVE HERO DESTINATION SLIDESHOW ("WINDOW INTO KERALA")
   Destinations: Wayanad, Munnar, Alappuzha, Varkala, Fort Kochi, Bekal
   -------------------------------------------------------------------------- */
function initDestinationSlideshow() {
  const windowEl = document.querySelector('.hero-destination-window');
  if (!windowEl) return;

  const slides = windowEl.querySelectorAll('.hero-slide-item');
  const dots = windowEl.querySelectorAll('.slideshow-dot');
  const counterCurrent = windowEl.querySelector('.slide-num-current');
  const totalSlides = slides.length;

  if (totalSlides === 0) return;

  let currentIndex = 0;
  let slideTimer = null;
  const slideIntervalMs = 6000; // 6 seconds auto-advance

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });

    if (counterCurrent) {
      counterCurrent.textContent = String(index + 1).padStart(2, '0');
    }

    currentIndex = index;
  }

  function startAutoAdvance() {
    stopAutoAdvance();
    slideTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, slideIntervalMs);
  }

  function stopAutoAdvance() {
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = null;
    }
  }

  // Dot Click Handlers
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.currentTarget.getAttribute('data-slide'), 10);
      if (!isNaN(targetIndex)) {
        goToSlide(targetIndex);
        startAutoAdvance(); // Reset timer
      }
    });
  });

  // Pause on hover, resume on mouse leave
  windowEl.addEventListener('mouseenter', stopAutoAdvance);
  windowEl.addEventListener('mouseleave', startAutoAdvance);

  // Initialize first slide and start timer
  goToSlide(0);
  startAutoAdvance();
}

/* --------------------------------------------------------------------------
   3. MOOD FILTERS
   -------------------------------------------------------------------------- */
function initMoodFilters() {
  const moodPills = document.querySelectorAll('.mood-pill-btn');

  moodPills.forEach(pill => {
    pill.addEventListener('click', () => {
      moodPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const selectedMood = pill.getAttribute('data-mood');
      filterDestinationsByMood(selectedMood);
    });
  });

  function filterDestinationsByMood(mood) {
    const cards = document.querySelectorAll('.trending-card-item');
    cards.forEach(card => {
      const cardMoods = (card.getAttribute('data-moods') || '').split(',');
      if (mood === 'all' || cardMoods.includes(mood)) {
        card.style.display = 'flex';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. SMOOTH SCROLLING
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
