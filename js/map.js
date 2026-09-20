/**
 * THΛNAL (തണൽ) — INTERACTIVE MAP MODULE
 * Provides both:
 * 1. A living Leaflet Map with authentic Kerala geography, destination pins,
 *    animated travel routes, and watercraft movement.
 * 2. An Illustrated Vector SVG Cartographic Map with district highlights & tooltips.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLeafletMap();
  initSvgMap();
  initMapViewToggle();
});

/* --------------------------------------------------------------------------
   1. LEAFLET MAP IMPLEMENTATION
   -------------------------------------------------------------------------- */
let leafletMapInstance = null;

function initLeafletMap() {
  const mapContainer = document.getElementById('leaflet-kerala-map');
  if (!mapContainer || typeof L === 'undefined') return;

  // Initialize Map centered on Kerala
  leafletMapInstance = L.map('leaflet-kerala-map', {
    center: [10.25, 76.5],
    zoom: 7.5,
    minZoom: 6.8,
    maxZoom: 13,
    zoomControl: true,
    scrollWheelZoom: false
  });

  // Warm CartoDB Voyager Tiles (matches ivory & forest design palette)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> | ThΛnal Kerala Tourism',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(leafletMapInstance);

  // Load Kerala District Boundaries from GeoJSON
  fetch('data/district.geojson')
    .then(res => res.json())
    .then(geojsonData => {
      const geoLayer = L.geoJSON(geojsonData, {
        style: {
          color: '#173B32',
          weight: 1.5,
          opacity: 0.85,
          fillColor: '#FAF9F5',
          fillOpacity: 0.35
        },
        onEachFeature: (feature, layer) => {
          const districtName = feature.properties?.DISTRICT || 'District';

          layer.on({
            mouseover: (e) => {
              const l = e.target;
              l.setStyle({
                fillColor: '#C9A875',
                fillOpacity: 0.65,
                weight: 2.5
              });
              l.bindTooltip(`<strong>${districtName}</strong><br><span style="font-size: 0.75rem; color: #173B32;">Click to explore</span>`, {
                sticky: true,
                direction: 'top'
              }).openTooltip();
            },
            mouseout: (e) => {
              geoLayer.resetStyle(e.target);
            },
            click: () => {
              openDistrict(districtName);
            }
          });
        }
      }).addTo(leafletMapInstance);

      // Fit map gently within Kerala's bounds
      try {
        leafletMapInstance.fitBounds(geoLayer.getBounds(), { padding: [15, 15] });
      } catch (err) {}
    })
    .catch(err => {
      console.warn('GeoJSON boundary load deferred:', err);
    });

  // Curated Destination Markers
  const destinations = [
    { name: 'Wayanad', lat: 11.6854, lng: 76.1320, category: 'Highlands & Caves' },
    { name: 'Bekal Fort', lat: 12.3927, lng: 75.0322, category: 'Coastal Citadel' },
    { name: 'Fort Kochi', lat: 9.9656, lng: 76.2421, category: 'Colonial Harbor' },
    { name: 'Athirappilly', lat: 10.3013, lng: 76.5517, category: 'Highland Cascades' },
    { name: 'Munnar', lat: 10.0889, lng: 77.0595, category: 'Tea Valleys & Mist' },
    { name: 'Thekkady', lat: 9.6031, lng: 77.1615, category: 'Periyar Reserve' },
    { name: 'Alappuzha', lat: 9.4981, lng: 76.3388, category: 'Backwaters & Canals' },
    { name: 'Varkala', lat: 8.7379, lng: 76.7163, category: 'Laterite Cliffs & Sea' }
  ];

  destinations.forEach(dest => {
    const pinHtml = `
      <div class="custom-leaflet-pin" title="${dest.name}">
        <div class="leaflet-pin-dot"></div>
        <span class="leaflet-pin-label">${dest.name}</span>
      </div>
    `;

    const icon = L.divIcon({
      html: pinHtml,
      className: '',
      iconSize: [80, 40],
      iconAnchor: [40, 7]
    });

    const marker = L.marker([dest.lat, dest.lng], { icon: icon }).addTo(leafletMapInstance);
    marker.bindPopup(`
      <div style="font-family: var(--font-sans); padding: 4px;">
        <h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: #173B32; margin-bottom: 2px;">${dest.name}</h4>
        <p style="font-size: 0.8125rem; color: #4A5B53; margin-bottom: 8px;">${dest.category}</p>
        <button onclick="openDistrict('${dest.name}')" style="background: #173B32; color: #FAF9F5; border: none; padding: 4px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">Explore Guide →</button>
      </div>
    `);
  });

  // Animated Classic Kerala Spice & Waterway Circuit Route
  const routeCoords = [
    [9.9656, 76.2421], // Fort Kochi
    [10.3013, 76.5517], // Athirappilly
    [10.0889, 77.0595], // Munnar
    [9.6031, 77.1615],  // Thekkady
    [9.6178, 76.4300],  // Kumarakom
    [9.4981, 76.3388],  // Alappuzha
    [8.7379, 76.7163]   // Varkala
  ];

  L.polyline(routeCoords, {
    color: '#A66A4C',
    weight: 3.5,
    opacity: 0.9,
    dashArray: '8, 8',
    className: 'animated-leaflet-route'
  }).addTo(leafletMapInstance);

  // Moving Houseboat Indicator along Alappuzha - Kumarakom Backwater Route
  const boatCoords = [
    [9.4981, 76.3388],
    [9.5500, 76.3800],
    [9.6178, 76.4300]
  ];

  const boatIcon = L.divIcon({
    html: '<div class="moving-boat-marker">🛶</div>',
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  const boatMarker = L.marker(boatCoords[0], { icon: boatIcon }).addTo(leafletMapInstance);
  boatMarker.bindTooltip('Houseboat Cruising Vembanad Waters', { direction: 'top' });

  // Animate boat moving gently between Alappuzha and Kumarakom
  let boatStep = 0;
  let boatForward = true;
  setInterval(() => {
    if (boatForward) {
      boatStep += 0.05;
      if (boatStep >= 1) {
        boatStep = 1;
        boatForward = false;
      }
    } else {
      boatStep -= 0.05;
      if (boatStep <= 0) {
        boatStep = 0;
        boatForward = true;
      }
    }

    // Interpolate lat/lng
    const lat = boatCoords[0][0] + (boatCoords[2][0] - boatCoords[0][0]) * boatStep;
    const lng = boatCoords[0][1] + (boatCoords[2][1] - boatCoords[0][1]) * boatStep;
    boatMarker.setLatLng([lat, lng]);
  }, 400);
}

/* --------------------------------------------------------------------------
   2. ILLUSTRATED SVG MAP IMPLEMENTATION
   -------------------------------------------------------------------------- */
function initSvgMap() {
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

/* --------------------------------------------------------------------------
   3. MAP VIEW TOGGLE (LEAFLET ROUTE MAP <-> SVG ILLUSTRATED MAP)
   -------------------------------------------------------------------------- */
function initMapViewToggle() {
  const btnLeaflet = document.getElementById('btn-show-leaflet');
  const btnSvg = document.getElementById('btn-show-svg');
  const leafletView = document.getElementById('leaflet-view-wrapper');
  const svgView = document.getElementById('svg-view-wrapper');

  if (!btnLeaflet || !btnSvg || !leafletView || !svgView) return;

  btnLeaflet.addEventListener('click', () => {
    btnLeaflet.classList.add('active');
    btnSvg.classList.remove('active');
    leafletView.style.display = 'block';
    svgView.style.display = 'none';

    // Invalidate Leaflet size upon becoming visible
    if (leafletMapInstance) {
      setTimeout(() => leafletMapInstance.invalidateSize(), 150);
    }
  });

  btnSvg.addEventListener('click', () => {
    btnSvg.classList.add('active');
    btnLeaflet.classList.remove('active');
    svgView.style.display = 'grid';
    leafletView.style.display = 'none';
  });
}
