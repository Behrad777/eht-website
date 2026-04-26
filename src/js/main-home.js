import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { companyContent } from './content.js';

gsap.registerPlugin(ScrollTrigger);

function boot() {
  const c = companyContent;

  // Populate nav
  const navLinks = document.getElementById('nav-links');
  if (navLinks) {
    navLinks.innerHTML = '';
    c.nav.forEach((item) => {
      const a = document.createElement('a');
      a.className = 'nav__link';
      a.href = item.href;
      a.textContent = item.label;
      navLinks.appendChild(a);
    });
  }
  const navCta = document.getElementById('nav-cta');
  if (navCta) { navCta.textContent = c.closing_cta.label; navCta.href = c.closing_cta.href; }

  // Populate product cards
  c.products.forEach((p, i) => {
    const card = document.getElementById(`product-card-${i}`);
    if (!card) return;
    card.querySelector('[data-product-name]').textContent = p.name;
    card.querySelector('[data-product-tagline]').textContent = p.tagline;
    card.querySelector('[data-product-description]').textContent = p.description;
    card.href = p.href;
    const benefitsList = card.querySelector('[data-product-benefits]');
    if (benefitsList) {
      benefitsList.innerHTML = '';
      p.benefits.forEach((b) => {
        const li = document.createElement('li');
        li.textContent = b;
        benefitsList.appendChild(li);
      });
    }
  });

  // Populate problem section
  const probCards = document.querySelectorAll('[data-prob-card]');
  c.problem_cards.forEach((pc, i) => {
    if (!probCards[i]) return;
    const t = probCards[i].querySelector('[data-prob-title]');
    const b = probCards[i].querySelector('[data-prob-body]');
    if (t) t.textContent = pc.title;
    if (b) b.textContent = pc.body;
  });

  // Stats bar
  const statRow = document.getElementById('home-stat-row');
  if (statRow) {
    statRow.innerHTML = '';
    c.shared_stats.forEach((stat) => {
      const el = document.createElement('div');
      el.className = 'stat';
      const numeric = stat.numeric;
      const prefix = stat.prefix || '';
      const suffix = stat.suffix || '';
      el.innerHTML = `
        <div class="stat__value" data-numeric="${numeric}" data-prefix="${prefix}" data-suffix="${suffix}" data-original="${stat.value}">${numeric ? `${prefix}0${suffix}` : stat.value}</div>
        <div class="stat__label">${stat.label}</div>
      `;
      statRow.appendChild(el);
    });
  }

  // Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function lenisRaf(time) { lenis.raf(time); requestAnimationFrame(lenisRaf); }
  requestAnimationFrame(lenisRaf);
  lenis.on('scroll', ScrollTrigger.update);
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      return arguments.length ? lenis.scrollTo(value, { immediate: true }) : window.scrollY;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
  });

  // Hero animation
  const nav = document.getElementById('nav');
  const heroEyebrow = document.querySelector('[data-hero-eyebrow]');
  const heroHeadlineWords = document.querySelectorAll('.home-hero__headline .home-word');
  const heroSub = document.querySelector('[data-hero-sub]');
  const heroCards = document.querySelectorAll('.product-entry');

  const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  introTl
    .to(heroEyebrow, { opacity: 1, y: 0, duration: 0.8 }, 0.3)
    .to(heroHeadlineWords, { opacity: 1, y: 0, duration: 0.9, stagger: 0.07 }, 0.6)
    .to(heroSub, { opacity: 1, y: 0, duration: 0.9 }, 1.1)
    .to(heroCards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 1.4)
    .add(() => { nav.classList.add('is-visible'); }, 1.0);

  // Nav solid on scroll
  ScrollTrigger.create({
    trigger: '#home-hero',
    start: 'bottom 70%',
    onEnter: () => nav.classList.add('is-solid'),
    onLeaveBack: () => nav.classList.remove('is-solid'),
  });

  // Scroll reveal for sections
  gsap.utils.toArray('.home-reveal').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
      },
    });
  });

  // Problem cards
  gsap.utils.toArray('.prob-card').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 28,
      duration: 0.7,
      ease: 'power3.out',
      delay: i * 0.08,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
    });
  });

  // Stats counter
  document.querySelectorAll('.stat__value').forEach((el) => {
    const original = el.dataset.original;
    const numericStr = el.dataset.numeric;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const hasNumeric = numericStr && numericStr !== 'null' && !Number.isNaN(parseFloat(numericStr));

    if (!hasNumeric) {
      el.textContent = original;
      gsap.from(el, {
        opacity: 0, y: 20, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
      return;
    }

    const target = parseFloat(numericStr);
    const state = { v: 0 };
    const isInt = !original.includes('.');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(state, {
          v: target, duration: 1.8, ease: 'power2.out',
          onUpdate: () => {
            const rendered = isInt ? Math.round(state.v).toLocaleString() : state.v.toFixed(1);
            el.textContent = `${prefix}${rendered}${suffix}`;
          },
          onComplete: () => { el.textContent = original; },
        });
      },
    });
  });

  ScrollTrigger.refresh();
}

boot();
