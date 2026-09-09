# THΛNAL (തണൽ) — Technical Architecture & Design System

## Overview
**ThΛnal (തണൽ)** is a premium travel discovery and editorial platform for Kerala, built with a modern mobile-first design system and lightweight static architecture.

---

## 1. Directory Structure

```
kerala-tourism/
├── index.html                   # Main editorial portal (20+ visual journey sections)
├── README.md                    # Project documentation
├── LICENSE                      # Open-source license (MIT)
├── .gitignore                   # Ignore rules for node/caches
│
├── assets/
│   ├── images/
│   │   ├── districts/           # All 14 preserved & normalized district images
│   │   ├── destinations/        # Destination photography
│   │   ├── experiences/         # Experience visuals
│   │   ├── food/                # Culinary heritage images
│   │   ├── culture/             # Classical arts & traditions
│   │   ├── hero/                # Atmospheric visuals
│   │   └── stories/             # Editorial imagery
│   ├── icons/                   # SVG iconography
│   ├── logos/                   # Thanal official logo & vectors
│   ├── maps/
│   │   ├── kerala.svg           # Accurate vector map from official GeoJSON
│   │   └── districts.svg        # 14 distinct interactive vector boundaries
│   └── fonts/                   # Typography files
│
├── css/
│   ├── style.css                # Base reset, typography, and imports
│   ├── variables.css            # System tokens (--forest, --ivory, fonts, radii)
│   ├── components.css           # Nav, Hero, Search, Map, Cards, Modals
│   ├── responsive.css           # Multi-tier breakpoints (1200px, 992px, 768px, 480px)
│   └── animations.css           # Micro-interactions & prefers-reduced-motion
│
├── js/
│   ├── main.js                  # Sticky nav, mood filters, smooth scroll
│   ├── search.js                # Live search across districts and destinations
│   ├── map.js                   # Interactive SVG Kerala map and tooltips
│   ├── districts.js             # District cards enhancement & click handlers
│   ├── favorites.js             # LocalStorage "My Kerala" wishlist drawer
│   ├── planner.js               # "Build Your Kerala" itinerary generator
│   └── data.js                  # Central data store for offline/static resilience
│
├── data/
│   ├── district.geojson         # Official district boundary coordinates
│   ├── state.geojson            # Official state boundary coordinates
│   ├── districts.json           # Detailed dataset for 14 districts
│   ├── destinations.json        # Curated popular and hidden destinations
│   ├── experiences.json         # Experiential categories
│   ├── food.json                # Traditional dishes & regional origins
│   └── stories.json             # Editorial magazine essays
│
├── pages/
│   ├── districts/               # 14 individual editorial district guides
│   │   ├── kasaragod.html
│   │   ├── kannur.html
│   │   ├── wayanad.html
│   │   ├── kozhikode.html
│   │   ├── malappuram.html
│   │   ├── palakkad.html
│   │   ├── thrissur.html
│   │   ├── ernakulam.html
│   │   ├── idukki.html
│   │   ├── kottayam.html
│   │   ├── alappuzha.html
│   │   ├── pathanamthitta.html
│   │   ├── kollam.html
│   │   └── thiruvananthapuram.html
│   ├── destinations/
│   ├── experiences/
│   ├── food/
│   └── stories/
│
└── docs/
    └── architecture.md          # System documentation
```

---

## 2. Design System Tokens

- **Primary**: `--forest: #173B32`, `--deep-forest: #0D2923`
- **Background**: `--ivory: #F5F1E8`, `--warm-white: #FAF9F5`
- **Nature**: `--moss: #6F8065`, `--sage: #8A9270`
- **Water**: `--backwater: #6F9A9A`, `--mist-blue: #A9C4C2`
- **Warm Accents**: `--sand: #C9A875`, `--terracotta: #A66A4C`
- **Ratio**: 75% Ivory / 20% Forest / 5% Accents

---

## 3. Typography
1. `Cormorant Garamond`: Editorial headlines, titles, destination names.
2. `Manrope`: UI, navigation, cards, metadata, search, buttons.
3. `Noto Sans Malayalam`: Native Malayalam script rendering.
