/**
 * THΛNAL (തണൽ) — MAIN APPLICATION SCRIPT
 * Coordinates navigation, sticky header states, mood filters, and global interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMoodFilters();
  initSmoothScroll();
});

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

function initMoodFilters() {
  const moodPills = document.querySelectorAll('.mood-pill-btn');
  const destinations = window.ThanalData?.destinations || [];

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
