/**
 * THΛNAL (തണൽ) — DISTRICTS MODULE
 * Preserves and enriches existing district card functionality & navigation
 */

function openDistrict(districtName) {
  if (!districtName) return;
  const cleanId = districtName.toLowerCase().replace(/\s+/g, '').replace('kasargod', 'kasaragod').replace('malapuram', 'malappuram');
  const targetUrl = `pages/districts/${cleanId}.html`;
  window.location.href = targetUrl;
}

// Enhance existing district cards with accessibility and keyboard navigation
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.district-card');
  cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
});
