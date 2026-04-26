import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAssembly({ pivot, camera, bbox, size, renderer, callouts }) {
  const pinEl = document.getElementById('reveal-pin');
  const revealSection = document.getElementById('reveal-section');
  const progressFill = document.getElementById('reveal-progress');
  const stepsEls = [...document.querySelectorAll('.reveal__step')];

  // Make all materials transparent-capable so we can fade up the whole mesh.
  pivot.traverse((o) => {
    if (o.isMesh && o.material) {
      o.material.transparent = true;
      o.material.depthWrite = true;
      o.material.opacity = 0.0;
      o.material.needsUpdate = true;
    }
  });

  // Overlay container for callouts
  const overlays = document.getElementById('overlays');
  const calloutState = callouts.map((c, i) => {
    const el = document.createElement('div');
    el.className = 'callout';
    el.dataset.index = i;
    el.innerHTML = `
      <span class="callout__dot"></span>
      <span class="callout__line"></span>
      <div class="callout__card">
        <span class="callout__num">${String(i + 1).padStart(2, '0')} / ${String(callouts.length).padStart(2, '0')}</span>
        <h4 class="callout__title">${c.title}</h4>
        <p class="callout__detail">${c.detail}</p>
      </div>
    `;
    overlays.appendChild(el);

    // world anchor — offsets are expressed as fractions of pivot size.
    // Pivot is centered at origin with uniform scale k, and internal bbox spans ~size.
    const [ox, oy, oz] = c.anchor_offset;
    const anchor = new THREE.Vector3(
      ox * size.x,
      oy * size.y,
      oz * size.z
    );
    return {
      el,
      anchor,
      dot: el.querySelector('.callout__dot'),
      line: el.querySelector('.callout__line'),
      card: el.querySelector('.callout__card'),
      visible: false,
      visTween: null,
      _mark: 0,
      _winSize: 0.22,
    };
  });

  // ---------------------------------------------------------------
  // Scroll-driven animation state
  // ---------------------------------------------------------------
  const state = {
    progress: 0,
    opacity: 0.0,
    orbitY: -0.55,       // radians around Y
    orbitX: 0.08,        // radians tilt
    camDist: 4.0,
    targetY: 0,
    modelTiltX: 0.04,
    modelTiltY: 0,
    // scratch
    _scratchTarget: new THREE.Vector3(),
  };

  // Staged callout markers — evenly spaced in the second half of the scroll.
  const markers = [0.22, 0.44, 0.66, 0.86];
  calloutState.forEach((c, i) => {
    c._mark = markers[i % markers.length];
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: revealSection,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.0,
      pin: pinEl,
      pinSpacing: true,
      onUpdate: (self) => {
        state.progress = self.progress;
        progressFill.style.transform = `scaleX(${self.progress})`;

        // step highlight
        let activeIdx = 0;
        for (let i = 0; i < calloutState.length; i++) {
          if (self.progress >= calloutState[i]._mark - 0.08) activeIdx = i;
        }
        stepsEls.forEach((s, i) => {
          s.classList.toggle('is-active', i === activeIdx);
        });
      },
    },
  });

  // Phase A (0 → 0.18): push-in + fade-up
  tl.to(state, {
    opacity: 1.0,
    camDist: 3.1,
    orbitY: -0.45,
    orbitX: 0.10,
    modelTiltY: -0.25,
    duration: 0.18,
    ease: 'power2.out',
  }, 0);

  // Phase B (0.18 → 0.5): first orbit sweep (right-side features)
  tl.to(state, {
    orbitY: 0.55,
    orbitX: 0.05,
    camDist: 2.7,
    modelTiltY: 0.35,
    duration: 0.32,
    ease: 'power1.inOut',
  }, 0.18);

  // Phase C (0.5 → 0.82): deep orbit around to opposite side (back + top)
  tl.to(state, {
    orbitY: Math.PI * 0.95,
    orbitX: -0.18,
    camDist: 2.9,
    modelTiltY: 0.8,
    duration: 0.32,
    ease: 'power1.inOut',
  }, 0.5);

  // Phase D (0.82 → 1): settle back to near-front, slight push out
  tl.to(state, {
    orbitY: Math.PI * 1.6,
    orbitX: 0.06,
    camDist: 3.3,
    modelTiltY: 1.2,
    duration: 0.18,
    ease: 'power2.inOut',
  }, 0.82);

  // RAF hook
  const canvas = renderer.domElement;
  function frameUpdate() {
    // apply opacity
    pivot.traverse((o) => {
      if (o.isMesh && o.material) {
        if (o.material.opacity !== state.opacity) {
          o.material.opacity = state.opacity;
        }
      }
    });

    // Only drive camera when reveal section is "active"
    // We use the scrollTrigger-driven progress to know whether to override
    const st = ScrollTrigger.getById('_assemblyTrigger');
    // fallback — just check if section is in view
    const rect = revealSection.getBoundingClientRect();
    const active = rect.top <= 0 && rect.bottom >= window.innerHeight;

    if (active) {
      const d = state.camDist;
      const cx = Math.sin(state.orbitY) * d * Math.cos(state.orbitX);
      const cz = Math.cos(state.orbitY) * d * Math.cos(state.orbitX);
      const cy = Math.sin(state.orbitX) * d + state.targetY;
      camera.position.set(cx, cy, cz);
      camera.lookAt(0, 0, 0);
      pivot.rotation.y = state.modelTiltY;
      pivot.rotation.x = state.modelTiltX;
    }

    // Always update callouts (even when inactive they fade out correctly)
    const rectC = canvas.getBoundingClientRect();
    const w = rectC.width;
    const h = rectC.height;

    calloutState.forEach((c, i) => {
      const world = c.anchor.clone();
      pivot.localToWorld(world);
      const ndc = world.clone().project(camera);
      const sx = (ndc.x * 0.5 + 0.5) * w;
      const sy = (-ndc.y * 0.5 + 0.5) * h;

      const inFront = ndc.z < 1 && ndc.z > -1;
      const onScreen = sx > 60 && sx < w - 60 && sy > 120 && sy < h - 120;
      const p = state.progress;
      const dist = Math.abs(p - c._mark);
      const inWindow = dist < c._winSize && p > 0.12;

      const shouldShow = active && inFront && onScreen && inWindow;

      if (shouldShow !== c.visible) {
        c.visible = shouldShow;
        if (c.visTween) c.visTween.kill();
        c.visTween = gsap.to(c.el, {
          opacity: shouldShow ? 1 : 0,
          duration: shouldShow ? 0.5 : 0.25,
          ease: shouldShow ? 'power2.out' : 'power2.in',
        });
      }

      c.dot.style.left = `${sx}px`;
      c.dot.style.top = `${sy}px`;

      // card placement — prefer right for even i, left for odd
      const preferRight = (i % 2 === 0);
      const cardWidth = 240;
      let cardLeft = preferRight ? sx + 90 : sx - 90 - cardWidth;
      // clamp within viewport
      if (cardLeft + cardWidth > w - 30) cardLeft = w - 30 - cardWidth;
      if (cardLeft < 30) cardLeft = 30;
      const cardTop = sy + (i % 2 === 0 ? -80 : 60);
      const finalCardTop = Math.max(100, Math.min(h - 140, cardTop));

      // Line connects dot → nearest card edge
      const lineX1 = sx;
      const lineY1 = sy;
      const cardEdgeX = (sx < cardLeft) ? cardLeft : cardLeft + cardWidth;
      const lineX2 = cardEdgeX;
      const lineY2 = finalCardTop;
      const dx = lineX2 - lineX1;
      const dy = lineY2 - lineY1;
      const len = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      c.line.style.left = `${lineX1}px`;
      c.line.style.top = `${lineY1}px`;
      c.line.style.width = `${len}px`;
      c.line.style.transform = `rotate(${angle}rad)`;

      c.card.style.left = `${cardLeft}px`;
      c.card.style.top = `${finalCardTop}px`;
    });
  }

  return { frameUpdate };
}
