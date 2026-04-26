import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { createScene } from './scene.js';
import { loadEht } from './models.js';
import { ehtContent, renderAll } from './content.js';
import { initHero } from './hero.js';
import { initAssembly } from './assembly.js';
import { initEhtDashboard } from './eht-dashboard.js';
import { initCounters } from './counter.js';
import { initAudience } from './audience.js';
import { initClosing } from './closing.js';

gsap.registerPlugin(ScrollTrigger);

async function boot() {
  renderAll(ehtContent);

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function lenisRaf(time) {
    lenis.raf(time);
    requestAnimationFrame(lenisRaf);
  }
  requestAnimationFrame(lenisRaf);
  lenis.on('scroll', ScrollTrigger.update);
  ScrollTrigger.defaults({ markers: false });
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      return arguments.length ? lenis.scrollTo(value, { immediate: true }) : window.scrollY;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
  });

  const canvas = document.getElementById('three-canvas');
  const { renderer, scene, camera } = createScene(canvas);

  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loader-fill');
  const loaderText = document.getElementById('loader-text');
  const model = await loadEht({
    onProgress: (p) => {
      const pct = Math.round(p * 100);
      loaderFill.style.width = `${pct}%`;
      loaderText.textContent = `Initialising · ${pct}%`;
    },
  });
  loaderText.textContent = 'Ready';
  loaderFill.style.width = '100%';

  scene.add(model.pivot);

  const hero = initHero({ pivot: model.pivot, camera });
  const assembly = initAssembly({
    pivot: model.pivot,
    camera,
    bbox: model.bbox,
    size: model.size,
    renderer,
    callouts: ehtContent.callouts,
  });
  const closing = initClosing({ pivot: model.pivot, camera, renderer });

  initEhtDashboard(ehtContent.bms_assets);
  initCounters();
  initAudience();

  setTimeout(() => {
    loader.classList.add('is-hidden');
    document.body.classList.remove('no-scroll');
    ScrollTrigger.refresh();
  }, 450);

  const drivers = [hero, assembly, closing];
  function frame() {
    drivers.forEach((d) => d.frameUpdate && d.frameUpdate());
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -20, duration: 1.4 });
      }
    });
  });

  let resizeTO;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => ScrollTrigger.refresh(), 150);
  });
}

document.body.classList.add('no-scroll');

boot().catch((err) => {
  console.error('EHT boot failure:', err);
  const loaderText = document.getElementById('loader-text');
  if (loaderText) loaderText.textContent = 'Failed to load — check console';
});
