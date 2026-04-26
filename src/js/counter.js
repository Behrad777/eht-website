import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initCounters() {
  document.querySelectorAll('.stat__value').forEach((el) => {
    const original = el.dataset.original;
    const numericStr = el.dataset.numeric;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const hasNumeric = numericStr !== '' && numericStr !== 'null' && !Number.isNaN(parseFloat(numericStr));

    if (!hasNumeric) {
      // Non-numeric stat (e.g., "24/7", "Weeks") — render directly, animated dash-in
      el.textContent = original;
      gsap.from(el, {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
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
          v: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            const rendered = isInt
              ? Math.round(state.v).toLocaleString()
              : state.v.toFixed(1);
            el.textContent = `${prefix}${rendered}${suffix}`;
          },
          onComplete: () => {
            // settle to exact source formatting
            el.textContent = original;
          },
        });
      },
    });
  });
}
