import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero choreography:
 *   - Model fades in (opacity 0 → 1)
 *   - Rotates 360° once, settling at a three-quarter hero angle
 *   - Eyebrow, headline (char-by-char), and subheadline cascade in
 *   - Nav slides down from above after the cascade
 *   - On scroll past hero, model rotates & shifts subtly to cue the next section
 */

export function initHero({ pivot, camera, onSettled }) {
  const nav = document.getElementById('nav');
  const eyebrow = document.querySelector('[data-hero-eyebrow]');
  const sub = document.querySelector('[data-hero-sub]');
  const headlineChars = document.querySelectorAll('.hero__headline .reveal-char');

  // Initial pivot state: hidden, rotated off-angle
  pivot.traverse((o) => {
    if (o.isMesh && o.material) {
      o.material.transparent = true;
      o.material.opacity = 0;
    }
  });
  pivot.rotation.set(0.04, -1.3, 0);
  pivot.position.y = -0.05;

  const state = {
    opacity: 0,
    rotationY: -1.3,
    rotationX: 0.04,
    posY: -0.05,
    scrollOffset: 0,
  };

  // Intro timeline — triggers once models are loaded.
  const introTl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      if (onSettled) onSettled();
    },
  });

  // Nav starts hidden. We'll reveal near the end of intro.
  // Model: fade + full rotation into hero pose.
  introTl.to(state, {
    opacity: 1.0,
    rotationY: Math.PI * 2 - 0.55, // 360° minus a touch to land three-quarter
    rotationX: 0.08,
    duration: 2.8,
    ease: 'power3.inOut',
    onUpdate: () => {
      // applied in the RAF loop
    },
  }, 0);

  // Eyebrow cascade
  introTl.to(eyebrow, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
  }, 0.8);

  // Headline char-by-char
  introTl.to(headlineChars, {
    y: 0,
    opacity: 1,
    duration: 0.95,
    stagger: 0.012,
    ease: 'power3.out',
  }, 1.0);

  // Sub
  introTl.to(sub, {
    opacity: 1,
    y: 0,
    duration: 1.0,
  }, 1.8);

  // Nav slide-in
  introTl.add(() => { nav.classList.add('is-visible'); }, 2.1);

  // Scroll-out of hero — subtle parallax as user begins to scroll
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.0,
    onUpdate: (self) => {
      state.scrollOffset = self.progress;
    },
  });

  // Nav-solid toggle
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'bottom 70%',
    onEnter: () => nav.classList.add('is-solid'),
    onLeaveBack: () => nav.classList.remove('is-solid'),
  });

  function frameUpdate() {
    // don't override when reveal section is active
    const revealSec = document.getElementById('reveal-section');
    const rRect = revealSec.getBoundingClientRect();
    const revealActive = rRect.top <= 0 && rRect.bottom >= window.innerHeight;
    if (revealActive) return;

    // hero <-> pre-reveal pose
    pivot.traverse((o) => {
      if (o.isMesh && o.material) {
        if (o.material.opacity !== state.opacity) o.material.opacity = state.opacity;
      }
    });
    // during intro or idle on hero
    pivot.rotation.y = state.rotationY + state.scrollOffset * 0.4;
    pivot.rotation.x = state.rotationX + state.scrollOffset * 0.04;
    pivot.position.y = state.posY - state.scrollOffset * 0.3;

    // Camera: static on hero, parallax push very slightly
    camera.position.set(0, 0.15, 3.2 - state.scrollOffset * 0.15);
    camera.lookAt(0, 0, 0);
  }

  return { frameUpdate, introTl };
}
