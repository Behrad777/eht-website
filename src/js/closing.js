import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Closing section drives the canvas to show a faint, slowly rotating silhouette.
 * When the section leaves view in either direction, it yields control.
 */

export function initClosing({ pivot, camera, renderer }) {
  const section = document.getElementById('closing');
  const state = {
    progress: 0,
    entered: false,
  };

  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onEnter: () => { state.entered = true; },
    onEnterBack: () => { state.entered = true; },
    onLeave: () => { state.entered = false; },
    onLeaveBack: () => { state.entered = false; },
  });

  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.2,
    onUpdate: (self) => {
      state.progress = self.progress;
    },
  });

  // Also gate the nav's "visible" state: hide nav at closing bottom? We'll keep visible.

  const t0 = performance.now();
  function frameUpdate() {
    if (!state.entered) return;
    // We only take over the canvas when the reveal section is NOT active
    const revealSec = document.getElementById('reveal-section');
    const rRect = revealSec.getBoundingClientRect();
    const revealActive = rRect.top <= 0 && rRect.bottom >= window.innerHeight;
    if (revealActive) return;

    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    const t = (performance.now() - t0) * 0.00025;
    // Faint, monochrome rotation
    pivot.traverse((o) => {
      if (o.isMesh && o.material) {
        // Fade to 0.18 opacity within the closing
        const targetOp = 0.16;
        if (Math.abs(o.material.opacity - targetOp) > 0.005) {
          o.material.opacity += (targetOp - o.material.opacity) * 0.08;
        }
      }
    });

    pivot.rotation.y = t * 2;
    pivot.rotation.x = 0.05;

    // Camera: slight top-down angle, bigger distance
    camera.position.set(0, 0.4, 3.9);
    camera.lookAt(0, 0.1, 0);
  }

  return { frameUpdate };
}
