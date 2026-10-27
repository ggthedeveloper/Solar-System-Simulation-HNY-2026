/**
 * Solar System Simulation - Happy New Year 2026
 * Developed by Gaurav Gautam
 */

(function () {
  "use strict";

  // Elements
  const orbits = [...document.querySelectorAll(".orbit")];
  const moonOrbit = document.querySelector(".moon-orbit");
  const earthOrbit = document.querySelector(".earth-orbit");
  const msg = document.getElementById("msg");
  const scene = document.getElementById("scene");
  const speed = document.getElementById("speed");
  const pauseBtn = document.getElementById("pauseBtn");
  const musicBtn = document.getElementById("musicBtn");
  const volume = document.getElementById("volume");
  const music = document.getElementById("bgMusic");
  const resetViewBtn = document.getElementById("resetViewBtn");
  const orbitCountEl = document.getElementById("orbitCount");
  const planetCard = document.getElementById("planetCard");
  const cardTitle = document.getElementById("cardTitle");
  const cardText = document.getElementById("cardText");

  // State
  let isPaused = false;
  let earthRevolutions = 0;
  let lastTime = performance.now();
  let tiltX = 0;
  let tiltY = 0;

  // Planet Info Database
  const PLANET_DATA = {
    sun: { name: "The Sun", desc: "Type G2V yellow dwarf star holding 99.86% of the Solar System's total mass. Surface temp: ~5,500°C." },
    mercury: { name: "Mercury", desc: "Smallest planet, closest to Sun. Orbital period: 88 Earth days. No atmosphere, extreme temp swings." },
    venus: { name: "Venus", desc: "Hottest planet due to runaway greenhouse atmosphere. Orbital period: 225 Earth days. Rotates backwards." },
    earth: { name: "Earth", desc: "Our home planet. Orbital period: 365.25 days. The only known celestial body harboring life and liquid water." },
    moon: { name: "The Moon", desc: "Earth's natural satellite. Orbits Earth every 27.3 days, stabilizing Earth's axial tilt and creating tides." },
    mars: { name: "Mars", desc: "The Red Planet. Orbital period: 687 Earth days. Home to Olympus Mons, the largest volcano in the solar system." },
    jupiter: { name: "Jupiter", desc: "King of planets, largest gas giant. Orbital period: 11.86 Earth years. Famous for its ancient Great Red Spot." },
    saturn: { name: "Saturn", desc: "Magnificent ringed gas giant. Orbital period: 29.45 Earth years. Composed mostly of hydrogen and helium." },
    uranus: { name: "Uranus", desc: "Ice giant tilted 98 degrees on its side. Orbital period: 84 Earth years. Pale cyan color from atmospheric methane." },
    neptune: { name: "Neptune", desc: "Farthest known planet. Orbital period: 164.8 Earth years. Features supersonic winds reaching over 2,000 km/h." },
  };

  // Continuous Orbital Simulation (Zero phase jump on speed changes)
  const orbitStates = orbits.map((el) => {
    const base = parseFloat(el.dataset.base || "1");
    // Speed factor: 1 Earth year = 12 seconds at 1x speed
    const angularSpeed = (2 * Math.PI) / (base * 12);
    return {
      el,
      base,
      angle: Math.random() * Math.PI * 2, // Distributed initial positions
      angularSpeed,
    };
  });

  let moonAngle = 0;
  const moonAngularSpeed = (2 * Math.PI) / 2.2; // Fast moon orbit

  // Web Audio Ambient Synthesizer Fallback
  let audioCtx = null;
  let synthGain = null;
  let synthOscillators = [];
  let isSynthPlaying = false;

  function initAmbientSynth() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      synthGain = audioCtx.createGain();
      synthGain.gain.setValueAtTime(parseFloat(volume.value) * 0.15, audioCtx.currentTime);
      synthGain.connect(audioCtx.destination);

      // Celestial chords: A2, E3, A3, C4 drone
      const freqs = [110.0, 164.81, 220.0, 261.63];
      synthOscillators = freqs.map((f) => {
        const osc = audioCtx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, audioCtx.currentTime);
        const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
        if (panner) {
          panner.pan.value = (Math.random() - 0.5) * 0.6;
          osc.connect(panner);
          panner.connect(synthGain);
        } else {
          osc.connect(synthGain);
        }
        osc.start();
        return osc;
      });
      isSynthPlaying = true;
    } catch (e) {
      console.warn("Web Audio ambient synth unavailable:", e);
    }
  }

  function toggleAudio() {
    if (music.paused && !isSynthPlaying) {
      music.play().then(() => {
        musicBtn.textContent = "Pause Music";
        musicBtn.setAttribute("aria-label", "Pause music");
      }).catch(() => {
        // Fallback to offline Web Audio synthesis
        initAmbientSynth();
        if (audioCtx && audioCtx.state === "suspended") {
          audioCtx.resume();
        }
        isSynthPlaying = true;
        musicBtn.textContent = "Pause Music";
      });
    } else {
      if (!music.paused) music.pause();
      if (isSynthPlaying && audioCtx) {
        audioCtx.suspend();
        isSynthPlaying = false;
      }
      musicBtn.textContent = "Play Music";
      musicBtn.setAttribute("aria-label", "Play music");
    }
  }

  musicBtn.onclick = toggleAudio;
  volume.oninput = () => {
    music.volume = volume.value;
    if (synthGain && audioCtx) {
      synthGain.gain.setValueAtTime(parseFloat(volume.value) * 0.15, audioCtx.currentTime);
    }
  };

  // Resize System Orbits
  function resizeSystem() {
    const system = document.querySelector(".system");
    if (!system) return;
    const size = system.clientWidth;
    orbits.forEach((o) => {
      const r = parseFloat(o.dataset.size || "0.5");
      o.style.width = size * r + "px";
      o.style.height = size * r + "px";
    });
  }
  window.addEventListener("resize", resizeSystem);
  resizeSystem();

  // Animation Loop
  function tick(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    if (!isPaused) {
      const currentSpeed = parseFloat(speed.value || "1");

      orbitStates.forEach((state) => {
        const prevAngle = state.angle;
        state.angle += state.angularSpeed * currentSpeed * dt;

        // Apply 2D rotation to orbit container
        const deg = (state.angle * 180) / Math.PI;
        state.el.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;

        // Check Earth revolution
        if (state.el === earthOrbit) {
          const prevTurns = Math.floor(prevAngle / (2 * Math.PI));
          const currTurns = Math.floor(state.angle / (2 * Math.PI));
          if (currTurns > prevTurns) {
            earthRevolutions++;
            if (orbitCountEl) {
              orbitCountEl.textContent = `Earth Year: 2026 (Orbit #${earthRevolutions})`;
            }
            if (msg && !msg.classList.contains("show")) {
              msg.classList.add("show");
            }
          }
        }
      });

      if (moonOrbit) {
        moonAngle += moonAngularSpeed * currentSpeed * dt;
        const moonDeg = (moonAngle * 180) / Math.PI;
        moonOrbit.style.transform = `translate(-50%, -50%) rotate(${moonDeg}deg)`;
      }
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Play / Pause Control
  if (pauseBtn) {
    pauseBtn.onclick = () => {
      isPaused = !isPaused;
      pauseBtn.textContent = isPaused ? "▶ Resume" : "⏸ Pause";
      pauseBtn.setAttribute("aria-label", isPaused ? "Resume simulation" : "Pause simulation");
    };
  }

  // Parallax Tilt (Mouse & Touch)
  function applyTilt(x, y) {
    tiltX = x;
    tiltY = y;
    if (scene) {
      scene.style.transform = `rotateY(${tiltX}deg) rotateX(${tiltY}deg)`;
    }
  }

  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * -30;
    applyTilt(x, y);
  });

  // Mobile Touch Support
  let touchStartX = 0;
  let touchStartY = 0;
  document.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  document.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1) {
      const dx = (e.touches[0].clientX - touchStartX) / window.innerWidth;
      const dy = (e.touches[0].clientY - touchStartY) / window.innerHeight;
      applyTilt(dx * 40, -dy * 40);
    }
  }, { passive: true });

  if (resetViewBtn) {
    resetViewBtn.onclick = () => applyTilt(0, 0);
  }

  // Keyboard Shortcuts
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      if (pauseBtn) pauseBtn.click();
    } else if (e.code === "ArrowUp") {
      speed.value = Math.min(5, parseFloat(speed.value) + 0.2);
    } else if (e.code === "ArrowDown") {
      speed.value = Math.max(0.2, parseFloat(speed.value) - 0.2);
    }
  });

  // Planet Info Inspection Cards
  function showPlanetInfo(key) {
    const info = PLANET_DATA[key];
    if (!info || !planetCard) return;
    cardTitle.textContent = info.name;
    cardText.textContent = info.desc;
    planetCard.classList.add("show");
  }

  document.querySelectorAll(".planet").forEach((p) => {
    p.addEventListener("click", (e) => {
      e.stopPropagation();
      const classes = [...p.classList];
      const planetKey = classes.find((c) => c !== "planet");
      if (planetKey) showPlanetInfo(planetKey);
    });
  });

  const sunEl = document.querySelector(".sun");
  if (sunEl) {
    sunEl.addEventListener("click", (e) => {
      e.stopPropagation();
      showPlanetInfo("sun");
    });
  }

  window.closePlanetCard = function () {
    if (planetCard) planetCard.classList.remove("show");
  };

  window.dismissCelebration = function () {
    if (msg) msg.classList.remove("show");
  };
})();
