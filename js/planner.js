/**
 * THΛNAL (തണൽ) — TRIP PLANNER MODULE
 * "Build Your Kerala" curated travel route generator.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTripPlanner();
});

function initTripPlanner() {
  const form = document.getElementById('trip-planner-form');
  const resultBox = document.getElementById('planner-result-box');
  const itineraryContainer = document.getElementById('itinerary-days-container');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const days = parseInt(document.getElementById('plan-days').value, 10) || 5;
    const interest = document.getElementById('plan-interest').value || 'nature';
    const style = document.getElementById('plan-style').value || 'balanced';
    const hub = document.getElementById('plan-hub').value || 'kochi';

    const itinerary = generateItinerary(days, interest, style, hub);
    renderItinerary(itinerary, days, hub);
  });

  function generateItinerary(days, interest, style, hub) {
    const itinerary = [];

    // Realistic curated routes depending on entry hub & duration
    if (hub === 'kochi') {
      itinerary.push({
        day: 1,
        location: "Kochi (Ernakulam)",
        title: "Colonial Harbors & Spice Warehouses",
        activities: "Morning walk past Chinese Fishing Nets, visit Jewish Synagogue in Mattancherry, sunset ferry across Kochi harbor, and evening Kathakali performance."
      });

      if (days >= 3) {
        itinerary.push({
          day: 2,
          location: "Munnar (Idukki)",
          title: "Ascent into Tea Mist & Shola Forests",
          activities: "Drive through Neriamangalam forest, explore Lockhart tea estate, visit the High Range Tea Museum, and enjoy panoramic viewpoints at Photo Point."
        });
      }

      if (days >= 4) {
        itinerary.push({
          day: 3,
          location: "Munnar & Eravikulam",
          title: "Wild Nilgiri Tahr & Anamudi Shadows",
          activities: "Morning safari in Eravikulam National Park, spot endangered Nilgiri Tahr, visit Mattupetty Dam, and leisurely plantation walk."
        });
      }

      if (days >= 5) {
        itinerary.push({
          day: 4,
          location: "Thekkady (Periyar)",
          title: "Cardamom Plantations & Lake Sanctuary",
          activities: "Spice garden guided tour, bamboo rafting or boat cruise in Periyar Tiger Reserve, and martial arts Kalaripayattu showcase."
        });
      }

      if (days >= 6) {
        itinerary.push({
          day: 5,
          location: "Kumarakom / Alappuzha",
          title: "Vembanad Backwaters & Canal Life",
          activities: "Board an eco-houseboat, drift through the paddy polders of Kuttanad, savor Karimeen Pollichathu cooked fresh on board."
        });
      }

      if (days >= 7) {
        itinerary.push({
          day: 6,
          location: "Marari Beach (Alappuzha)",
          title: "Quiet Palms & Arabian Waves",
          activities: "Unwind at secluded Marari fisherman beach, visit coir making workshops, and enjoy fresh coastal seafood under starlight."
        });
        itinerary.push({
          day: 7,
          location: "Fort Kochi Departure",
          title: "Art Cafes & Departure",
          activities: "Morning artisan shopping on Princess Street, coffee at heritage cafes, and transfer to Cochin International Airport."
        });
      }
    } else if (hub === 'trivandrum') {
      itinerary.push({
        day: 1,
        location: "Thiruvananthapuram & Kovalam",
        title: "Royal Temples & Crescent Bays",
        activities: "Visit Sree Padmanabhaswamy Temple, stroll around Napier Museum, and watch sunset from Kovalam Lighthouse Beach."
      });
      if (days >= 2) {
        itinerary.push({
          day: 2,
          location: "Varkala Cliff",
          title: "Laterite Cliffs & Mineral Springs",
          activities: "Walk along the northern cliff rim, swim in Papanasam beach waters, and dine at clifftop cafes."
        });
      }
      if (days >= 3) {
        itinerary.push({
          day: 3,
          location: "Munroe Island (Kollam)",
          title: "Mangrove Canals & Island Village",
          activities: "Early morning country canoe tour through Munroe island channels, coconut coir demonstration, and local fish curry meal."
        });
      }
      if (days >= 4) {
        itinerary.push({
          day: 4,
          location: "Jatayu Earth's Center & Ponmudi",
          title: "Mythic Sculpture & Golden Hills",
          activities: "Cable car up to the world's largest bird sculpture at Chadayamangalam, followed by a cool drive into Ponmudi hills."
        });
      }
    } else {
      // Kozhikode / Malabar hub
      itinerary.push({
        day: 1,
        location: "Kozhikode",
        title: "Culinary Soul of Malabar",
        activities: "Visit historic Sweet Meat Street (SM Street), taste genuine Kozhikodan Dum Biryani, and walk past colonial pier ruins at dusk."
      });
      if (days >= 2) {
        itinerary.push({
          day: 2,
          location: "Wayanad (Vythiri & Chembra)",
          title: "Ascent up Thamarassery Churam",
          activities: "Climb through 9 scenic hairpin curves into misty Wayanad, trek to Chembra heart-shaped lake, and visit tea plantations."
        });
      }
      if (days >= 3) {
        itinerary.push({
          day: 3,
          location: "Wayanad (Edakkal Caves)",
          title: "Prehistoric Stone Petroglyphs",
          activities: "Climb to Edakkal Caves to witness Neolithic rock etchings, visit Banasura Sagar earthen dam, and bamboo raft at Kuruva Dweep."
        });
      }
    }

    return itinerary;
  }

  function renderItinerary(itinerary, days, hub) {
    if (!resultBox || !itineraryContainer) return;

    itineraryContainer.innerHTML = itinerary.map(item => `
      <div class="itinerary-day-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="font-weight: 700; font-size: 0.8125rem; text-transform: uppercase; color: var(--terracotta); letter-spacing: 0.08em;">Day ${item.day} • ${item.location}</span>
        </div>
        <h4 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--deep-forest); margin-bottom: 6px;">${item.title}</h4>
        <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.55;">${item.activities}</p>
      </div>
    `).join('');

    resultBox.classList.add('active');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
