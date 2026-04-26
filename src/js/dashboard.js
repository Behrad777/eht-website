import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initDashboard() {
  const cards = document.querySelectorAll('[data-twin-card]');

  // Fade + lift cards in sequence as the section enters view
  gsap.to(cards, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#dashboard',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  // Health score ring + counter
  const healthRing = document.getElementById('health-ring');
  const healthValue = document.getElementById('health-value');
  const healthLabel = document.getElementById('health-ring-label');
  const target = 92;

  ScrollTrigger.create({
    trigger: '#dashboard',
    start: 'top 60%',
    once: true,
    onEnter: () => {
      // ring fill — circumference 2πr = 2π*43 ≈ 270
      const C = 2 * Math.PI * 43;
      const dashOffset = C - (C * target) / 100;
      healthRing.style.strokeDasharray = C;
      healthRing.style.strokeDashoffset = dashOffset;
      // counter
      const state = { v: 0 };
      gsap.to(state, {
        v: target,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: () => {
          const rounded = Math.round(state.v);
          healthValue.textContent = rounded;
          healthLabel.textContent = rounded;
        },
      });
    },
  });

  // Heat grid — animate cells lighting up in a procedural thermal pattern
  buildHeatGrid();

  // Waveform — render three phase-shifted sines
  buildWaves();
}

function buildHeatGrid() {
  const grid = document.getElementById('heat-grid');
  const cells = [...grid.children];
  // Pattern: a warm region around a specific cell to simulate a contactor hotspot
  const hotR = 3, hotC = 4;  // near centre-right
  const temps = cells.map((_, i) => {
    const r = Math.floor(i / 8);
    const c = i % 8;
    const d = Math.hypot(r - hotR, c - hotC);
    // temp from 0 (cool) to 1 (hot)
    const t = Math.max(0, 1 - d / 5);
    return t + (Math.random() * 0.08 - 0.04);
  });

  // initial paint — muted
  cells.forEach((cell) => {
    cell.style.background = '#eaeae6';
  });

  ScrollTrigger.create({
    trigger: '#dashboard',
    start: 'top 55%',
    once: true,
    onEnter: () => {
      cells.forEach((cell, i) => {
        const t = Math.max(0, Math.min(1, temps[i]));
        const color = heatColor(t);
        gsap.to(cell, {
          background: color,
          duration: 0.5 + t * 0.6,
          delay: 0.3 + Math.random() * 0.4,
          ease: 'power2.out',
        });
      });

      // Subtle breathing animation for the hottest cells
      cells.forEach((cell, i) => {
        if (temps[i] > 0.6) {
          gsap.to(cell, {
            opacity: 0.7,
            duration: 1.2 + Math.random() * 0.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.5 + Math.random() * 1,
          });
        }
      });
    },
  });
}

function heatColor(t) {
  // map 0..1 to a cool-to-warm ramp that fits the palette
  // cool: #e8e8e4 → mid: #cfd3df (soft slate) → warm: #e6b496 → hot: #c86a3c
  const stops = [
    { at: 0.00, rgb: [232, 232, 228] },
    { at: 0.35, rgb: [200, 206, 218] },
    { at: 0.60, rgb: [220, 180, 150] },
    { at: 0.85, rgb: [210, 125, 80] },
    { at: 1.00, rgb: [200, 106, 60] },
  ];
  let a = stops[0], b = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].at && t <= stops[i + 1].at) {
      a = stops[i]; b = stops[i + 1];
      break;
    }
  }
  const lerpT = (t - a.at) / (b.at - a.at || 1);
  const r = Math.round(a.rgb[0] + (b.rgb[0] - a.rgb[0]) * lerpT);
  const g = Math.round(a.rgb[1] + (b.rgb[1] - a.rgb[1]) * lerpT);
  const bl = Math.round(a.rgb[2] + (b.rgb[2] - a.rgb[2]) * lerpT);
  return `rgb(${r}, ${g}, ${bl})`;
}

function buildWaves() {
  const W = 400, H = 120;
  const midY = H / 2;
  const amp = 28;

  function pathFor(phase, freq, harmonicAmp, harmonicFreq) {
    const N = 80;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * W;
      const t = (i / N) * Math.PI * 2 * freq + phase;
      const y = midY
        - Math.sin(t) * amp
        - Math.sin(t * harmonicFreq) * harmonicAmp;
      pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return pts.join(' ');
  }

  const paths = {
    a: document.getElementById('wave-a'),
    b: document.getElementById('wave-b'),
    c: document.getElementById('wave-c'),
  };

  // Initialize static paths
  paths.a.setAttribute('d', pathFor(0, 3, 0, 1));
  paths.b.setAttribute('d', pathFor(Math.PI * 2 / 3, 3, 0, 1));
  paths.c.setAttribute('d', pathFor(Math.PI * 4 / 3, 3, 0, 1));

  // Animate: keep offsets so the waves appear to scroll, with a subtle harmonic
  let t0 = performance.now();
  let running = false;
  ScrollTrigger.create({
    trigger: '#dashboard',
    start: 'top bottom',
    end: 'bottom top',
    onEnter: () => { running = true; },
    onLeave: () => { running = false; },
    onEnterBack: () => { running = true; },
    onLeaveBack: () => { running = false; },
  });

  function tick(now) {
    if (running) {
      const t = (now - t0) * 0.001;
      const phase = t * 1.6;
      // harmonic rides the waveform — emulates a developing fault signature
      const hAmp = 3 + Math.sin(t * 0.8) * 1.5;
      paths.a.setAttribute('d', pathFor(phase, 3, hAmp, 7));
      paths.b.setAttribute('d', pathFor(phase + Math.PI * 2 / 3, 3, hAmp * 0.7, 7));
      paths.c.setAttribute('d', pathFor(phase + Math.PI * 4 / 3, 3, hAmp * 0.5, 7));
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
