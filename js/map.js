/**
 * THΛNAL (തണൽ) — INTERACTIVE KERALA MAP MODULE
 * Cartographic vector visualization with authentic boundaries, tooltips & district detail syncing.
 */

document.addEventListener('DOMContentLoaded', () => {
  initKeralaMap();
});

function initKeralaMap() {
  const mapSvg = document.querySelector('.kerala-interactive-svg');
  const tooltip = document.getElementById('map-tooltip');
  const infoTitle = document.getElementById('map-info-title');
  const infoMl = document.getElementById('map-info-ml');
  const infoTagline = document.getElementById('map-info-tagline');
  const infoDesc = document.getElementById('map-info-desc');
  const infoHighlights = document.getElementById('map-info-highlights');
  const infoLink = document.getElementById('map-info-link');

  if (!mapSvg) return;

  const districtPaths = mapSvg.querySelectorAll('.map-district-path');

  districtPaths.forEach(path => {
    const districtName = path.getAttribute('data-district');
    const districtData = window.ThanalData && window.ThanalData.districts.find(
      d => d.name.toLowerCase() === districtName.toLowerCase()
    );

    path.addEventListener('mouseenter', (e) => {
      highlightDistrict(path);
      showTooltip(e, districtData || { name: districtName, nameMl: path.getAttribute('data-ml'), description: path.getAttribute('data-desc') });
    });

    path.addEventListener('mousemove', (e) => {
      moveTooltip(e);
    });

    path.addEventListener('mouseleave', () => {
      unhighlightDistrict(path);
      hideTooltip();
    });

    path.addEventListener('focus', () => {
      highlightDistrict(path);
      updateSidebar(districtData || { name: districtName });
    });

    path.addEventListener('blur', () => {
      unhighlightDistrict(path);
    });

    path.addEventListener('click', () => {
      openDistrict(districtName);
    });

    path.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDistrict(districtName);
      }
    });
  });

  function highlightDistrict(targetPath) {
    districtPaths.forEach(p => {
      if (p === targetPath) {
        p.classList.add('highlighted');
      } else {
        p.style.opacity = '0.65';
      }
    });

    const dName = targetPath.getAttribute('data-district');
    const dData = window.ThanalData && window.ThanalData.districts.find(
      d => d.name.toLowerCase() === dName.toLowerCase()
    );
    if (dData) {
      updateSidebar(dData);
    }
  }

  function unhighlightDistrict(targetPath) {
    districtPaths.forEach(p => {
      p.classList.remove('highlighted');
      p.style.opacity = '1';
    });
  }

  function showTooltip(e, data) {
    if (!tooltip) return;
    tooltip.innerHTML = `
      <div class="tooltip-title">${data.name}</div>
      <div class="tooltip-ml">${data.nameMl || ''}</div>
      <div class="tooltip-desc">${data.description || data.tagline || ''}</div>
      <div style="margin-top: 8px; font-size: 0.75rem; font-weight: 700; color: var(--terracotta);">Click to explore →</div>
    `;
    tooltip.classList.add('visible');
    moveTooltip(e);
  }

  function moveTooltip(e) {
    if (!tooltip) return;
    const container = document.querySelector('.map-container-box');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left + 15;
    const y = e.clientY - rect.top - 20;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  function hideTooltip() {
    if (!tooltip) return;
    tooltip.classList.remove('visible');
  }

  function updateSidebar(data) {
    if (!infoTitle || !data) return;
    infoTitle.textContent = data.name;
    if (infoMl) infoMl.textContent = data.nameMl || '';
    if (infoTagline) infoTagline.textContent = data.tagline || data.region || '';
    if (infoDesc) infoDesc.textContent = data.description || '';
    if (infoLink) infoLink.href = data.pageUrl || `pages/districts/${data.id}.html`;

    if (infoHighlights && data.topDestinations) {
      infoHighlights.innerHTML = data.topDestinations.map(item => `
        <div class="map-highlight-item">
          <div class="map-highlight-dot"></div>
          <span>${item}</span>
        </div>
      `).join('');
    }
  }
}
