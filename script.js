/**
 * THΛNAL (തണൽ) — LEGACY SCRIPT BRIDGE
 * Preserves compatibility with existing event listeners & function calls.
 */

// openDistrict function ensures compatibility with any legacy onclick handlers
if (typeof window.openDistrict !== 'function') {
  window.openDistrict = function(districtName) {
    if (!districtName) return;
    const cleanId = districtName.toLowerCase().replace(/\s+/g, '').replace('kasargod', 'kasaragod').replace('malapuram', 'malappuram');
    window.location.href = `pages/districts/${cleanId}.html`;
  };
}
