/**
 * THΛNAL (തണൽ) — SEARCH MODULE
 * Enhanced live search supporting districts, destinations, culinary items, and experiences.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
});

function initSearch() {
  const searchInputs = document.querySelectorAll('.search-box, .hero-search-input');
  const resultsTray = document.getElementById('search-results-tray');

  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      handleSearch(query);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeTray();
      }
    });
  });

  // Close search tray when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hero-search-wrapper') && !e.target.closest('.logo-container') && !e.target.closest('#search-results-tray')) {
      closeTray();
    }
  });

  function handleSearch(query) {
    filterDistrictCards(query);

    if (!query || query.length < 2) {
      closeTray();
      return;
    }

    const matches = findMatches(query);
    renderResults(matches);
  }

  function filterDistrictCards(query) {
    const cards = document.querySelectorAll('.district-card');
    cards.forEach(card => {
      const cardText = card.textContent.toLowerCase();
      if (!query || cardText.includes(query)) {
        card.style.display = 'block';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function findMatches(query) {
    const matches = [];

    // Search Districts
    if (window.ThanalData && window.ThanalData.districts) {
      window.ThanalData.districts.forEach(d => {
        if (
          d.name.toLowerCase().includes(query) ||
          (d.nameMl && d.nameMl.includes(query)) ||
          d.description.toLowerCase().includes(query) ||
          d.topDestinations.some(dest => dest.toLowerCase().includes(query))
        ) {
          matches.push({
            title: d.name,
            subtitle: `${d.nameMl || ''} — ${d.region}`,
            tag: 'District',
            url: d.pageUrl || `pages/districts/${d.id}.html`
          });
        }
      });
    }

    return matches.slice(0, 8);
  }

  function renderResults(matches) {
    if (!resultsTray) return;

    if (matches.length === 0) {
      resultsTray.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.875rem;">
          No Kerala destinations found matching your search.
        </div>
      `;
    } else {
      resultsTray.innerHTML = matches.map(item => `
        <a href="${item.url}" class="search-result-item">
          <div class="search-result-meta">
            <span class="search-result-title">${item.title}</span>
            <span class="search-result-subtitle">${item.subtitle}</span>
          </div>
          <span class="search-result-tag">${item.tag}</span>
        </a>
      `).join('');
    }

    resultsTray.classList.add('active');
  }

  function closeTray() {
    if (resultsTray) {
      resultsTray.classList.remove('active');
    }
  }
}
