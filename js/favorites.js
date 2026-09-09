/**
 * THΛNAL (തണൽ) — FAVORITES / "MY KERALA" MODULE
 * LocalStorage powered traveler wishlist & saved drawer.
 */

const FAVORITES_STORAGE_KEY = 'thanal_saved_destinations';

document.addEventListener('DOMContentLoaded', () => {
  initFavorites();
});

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveFavorites(items) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
}

function toggleFavorite(item) {
  let favs = getFavorites();
  const existsIndex = favs.findIndex(f => f.id === item.id);

  if (existsIndex >= 0) {
    favs.splice(existsIndex, 1);
  } else {
    favs.push({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle || '',
      type: item.type || 'Destination',
      url: item.url || '#'
    });
  }

  saveFavorites(favs);
  updateFavoritesUI();
}

function removeFavorite(id) {
  let favs = getFavorites();
  favs = favs.filter(f => f.id !== id);
  saveFavorites(favs);
  updateFavoritesUI();
}

function updateFavoritesUI() {
  const favs = getFavorites();
  const badges = document.querySelectorAll('.fav-counter-badge');
  badges.forEach(b => {
    b.textContent = favs.length;
  });

  // Update save buttons state across the page
  const saveButtons = document.querySelectorAll('.card-save-btn');
  saveButtons.forEach(btn => {
    const itemId = btn.getAttribute('data-id');
    const isSaved = favs.some(f => f.id === itemId);
    if (isSaved) {
      btn.classList.add('saved');
      btn.setAttribute('aria-label', 'Remove from saved');
      btn.innerHTML = '♥';
    } else {
      btn.classList.remove('saved');
      btn.setAttribute('aria-label', 'Save to My Kerala');
      btn.innerHTML = '♡';
    }
  });

  renderDrawerList(favs);
}

function renderDrawerList(favs) {
  const listContainer = document.getElementById('drawer-saved-list');
  if (!listContainer) return;

  if (favs.length === 0) {
    listContainer.innerHTML = `
      <div class="drawer-empty-state">
        <p style="font-size: 1.1rem; font-family: var(--font-serif); margin-bottom: 8px;">Your Kerala journey is empty.</p>
        <p style="font-size: 0.875rem;">Click the ♡ icon on any destination or experience to save it to your trip wishlist.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = favs.map(item => `
    <div class="saved-item-card">
      <div class="saved-item-info">
        <h4>${item.title}</h4>
        <span>${item.type} ${item.subtitle ? '• ' + item.subtitle : ''}</span>
      </div>
      <button class="saved-item-remove-btn" onclick="removeFavorite('${item.id}')" title="Remove item">✕</button>
    </div>
  `).join('');
}

function initFavorites() {
  updateFavoritesUI();

  // Drawer open / close handlers
  const openButtons = document.querySelectorAll('.nav-favorites-btn, #open-drawer-btn');
  const closeButton = document.getElementById('close-drawer-btn');
  const backdrop = document.getElementById('drawer-backdrop');
  const drawer = document.getElementById('favorites-drawer');

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (drawer) drawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
    });
  });

  function closeDrawer() {
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
  }

  if (closeButton) closeButton.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
}
