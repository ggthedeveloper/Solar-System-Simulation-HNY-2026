# 🪐 Solar System Simulation – Happy New Year 2026

An interactive, responsive 3D Solar System simulation celebrating **Happy New Year 2026**. Features proportional Keplerian orbital velocities, interactive mouse and touch parallax, celestial ambient audio with offline synthesis fallback, and interactive planet cards.

---

## ✨ Features

- **Accurate Relative Orbital Speeds:** Each planet orbits at its Keplerian base period (from Mercury at 0.24 Earth years to Neptune at 165 Earth years).
- **Smooth Speed Adjustments:** Smooth orbital interpolation calculated via `requestAnimationFrame` with zero phase jumping.
- **Interactive 3D Parallax:** Orbit perspective tilts dynamically with mouse movement on desktop and touch drag on mobile devices.
- **Celestial Audio Engine:** Ambient music with automatic Web Audio API synthesizer drone fallback for 100% offline playback.
- **Interactive Planet Fact Cards:** Click or tap on any planet or the Sun to reveal astronomical specifications and discoveries.
- **Orbit Counter & Celebration:** Dynamically counts Earth revolutions and celebrates the New Year 2026 milestone.
- **Keyboard Shortcuts:**
  - `Space`: Pause / Resume simulation
  - `↑ / ↓`: Increase or decrease orbit speed

---

## 🚀 Running Locally

No build tools or servers required. Simply open `index.html` in any modern web browser:

```bash
# Clone the repository
git clone https://github.com/ggthedeveloper/Solar-System-Simulation-HNY-2026.git
cd Solar-System-Simulation-HNY-2026

# Open directly in your browser
open index.html
```

---

## 🛠️ Technology Stack

- **HTML5:** Semantic markup with ARIA accessibility roles
- **CSS3:** 3D CSS transforms (`preserve-3d`, `perspective`), starfield radial gradients, and responsive glassmorphism docks
- **Vanilla JavaScript:** High-performance animation loop, Web Audio API synthesis, and multi-touch gesture handlers

---

## 👨‍💻 Developer

Developed by **Gaurav Gautam** (`ggthedeveloper`).
