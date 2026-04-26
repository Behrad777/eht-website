import { gsap } from 'gsap';

const ROTATE_MS = 4400;

export function initAudience() {
  const slots = [...document.querySelectorAll('.audience__slot')];
  const dots = [...document.querySelectorAll('.audience__dot')];
  if (slots.length === 0) return;

  let current = 0;
  let timer = null;
  let progressTween = null;

  function show(i) {
    slots.forEach((s, idx) => {
      s.classList.toggle('is-active', idx === i);
    });
    dots.forEach((d, idx) => {
      d.classList.toggle('is-active', idx === i);
      d.classList.toggle('is-progress', idx === i);
      if (idx !== i) d.style.setProperty('--progress', '0%');
    });

    // restart progress-fill tween on the active dot
    if (progressTween) progressTween.kill();
    const active = dots[i];
    if (active) {
      active.style.setProperty('--progress', '0%');
      progressTween = gsap.to(active, {
        '--progress': '100%',
        duration: ROTATE_MS / 1000,
        ease: 'none',
      });
    }
  }

  function next() {
    current = (current + 1) % slots.length;
    show(current);
  }

  function start() {
    stop();
    show(current);
    timer = setInterval(next, ROTATE_MS);
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    if (progressTween) { progressTween.kill(); progressTween = null; }
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      current = i;
      start(); // reset timer
    });
  });

  // Start only when section is in view
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) start();
      else stop();
    });
  }, { threshold: 0.4 });
  io.observe(document.getElementById('audience'));
}
