import brief from '../../content-brief.json';

export const motiqContent = brief.motiq;
export const ehtContent = brief.eht;
export const companyContent = brief.company;

/* ------------------------------------------------------------
   text → char spans for reveal animation
   ------------------------------------------------------------ */
export function splitToChars(text) {
  const wrap = document.createElement('span');
  wrap.className = 'reveal-line-wrap';
  text.split('').forEach((ch) => {
    const s = document.createElement('span');
    s.className = 'reveal-char';
    s.textContent = ch === ' ' ? ' ' : ch;
    wrap.appendChild(s);
  });
  return wrap;
}

/* ------------------------------------------------------------
   Nav
   ------------------------------------------------------------ */
export function renderNav(content) {
  const container = document.getElementById('nav-links');
  if (!container) return;
  container.innerHTML = '';
  content.nav.forEach((item) => {
    const a = document.createElement('a');
    a.className = 'nav__link';
    if (item.type === 'page') {
      a.href = item.href;
    } else {
      a.href = item.id === 'reveal' ? '#reveal-section' : `#${item.id}`;
    }
    a.textContent = item.label;
    container.appendChild(a);
  });
  const navCta = document.getElementById('nav-cta');
  if (navCta && content.nav_cta) {
    navCta.textContent = content.nav_cta.label;
    navCta.href = content.nav_cta.href;
  }
}

/* ------------------------------------------------------------
   Hero text
   ------------------------------------------------------------ */
export function renderHero(content) {
  const h = document.querySelector('[data-hero-headline]');
  if (!h) return;
  h.innerHTML = '';
  const headline = content.hero_headline;
  const words = headline.split(' ');
  let lineBuckets;
  if (words.length <= 4) {
    lineBuckets = [words];
  } else {
    const half = Math.ceil(words.length / 2);
    lineBuckets = [words.slice(0, half), words.slice(half)];
  }
  lineBuckets.forEach((lineWords) => {
    const line = document.createElement('span');
    line.className = 'line';
    lineWords.forEach((w, i) => {
      w.split('').forEach((ch) => {
        const s = document.createElement('span');
        s.className = 'reveal-char';
        s.textContent = ch;
        line.appendChild(s);
      });
      if (i < lineWords.length - 1) {
        const sp = document.createElement('span');
        sp.className = 'reveal-char';
        sp.innerHTML = '&nbsp;';
        line.appendChild(sp);
      }
    });
    h.appendChild(line);
  });

  const eyebrow = document.querySelector('[data-hero-eyebrow]');
  if (eyebrow) eyebrow.textContent = content.hero_eyebrow;
  const sub = document.querySelector('[data-hero-sub]');
  if (sub) sub.textContent = content.hero_subheadline;
  document.querySelectorAll('[data-brand]').forEach((el) => { el.textContent = content.product_name; });
}

/* ------------------------------------------------------------
   Reveal / Anatomy
   ------------------------------------------------------------ */
export function renderRevealCopy(content) {
  const rv = content.sections.find((s) => s.id === 'reveal');
  if (!rv) return;
  const title = document.querySelector('[data-reveal-title]');
  const body = document.querySelector('[data-reveal-body]');
  if (title) title.textContent = rv.headline;
  if (body) body.textContent = rv.body_short;

  const steps = document.getElementById('reveal-steps');
  if (!steps) return;
  steps.innerHTML = '';
  content.callouts.forEach((c, i) => {
    const s = document.createElement('span');
    s.className = 'reveal__step';
    s.dataset.index = i;
    s.textContent = `0${i + 1} · ${c.title}`;
    steps.appendChild(s);
  });
}

/* ------------------------------------------------------------
   Dashboard copy
   ------------------------------------------------------------ */
export function renderDashboard(content) {
  const d = content.sections.find((s) => s.id === 'dashboard');
  if (!d) return;
  const title = document.querySelector('[data-dashboard-title]');
  const body = document.querySelector('[data-dashboard-body]');
  if (title) title.textContent = d.headline;
  if (body) body.textContent = d.body_long;

  const grid = document.getElementById('heat-grid');
  if (grid) {
    grid.innerHTML = '';
    for (let i = 0; i < 64; i++) {
      const cell = document.createElement('div');
      cell.className = 'heat-cell';
      cell.dataset.index = i;
      grid.appendChild(cell);
    }
  }
}

/* ------------------------------------------------------------
   Feature cards
   ------------------------------------------------------------ */
const iconMap = {
  'Electrical Intelligence': () => `
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <path d="M2 22 Q8 8 14 22 T26 22 T38 22 L42 22" opacity="0.95" />
      <path d="M2 22 Q8 36 14 22 T26 22 T38 22 L42 22" opacity="0.55" />
      <path d="M2 22 L42 22" stroke-dasharray="1 3" opacity="0.35" />
    </svg>`,
  'Thermal Awareness': () => {
    let cells = '';
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++) {
        const active = (r === 1 && c === 1);
        const x = 4 + c * 12, y = 4 + r * 12;
        cells += `<rect x="${x}" y="${y}" width="10" height="10" rx="1" fill="${active ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1" opacity="${active ? 1 : 0.55}" />`;
      }
    return `<svg viewBox="0 0 44 44" fill="none">${cells}</svg>`;
  },
  'Health Score': () => `
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.4">
      <circle cx="22" cy="22" r="16" stroke-opacity="0.2" />
      <path d="M22 6 A16 16 0 0 1 37.5 19" stroke-linecap="round" />
      <line x1="22" y1="22" x2="30" y2="15" stroke-linecap="round" />
    </svg>`,
  'Predictive Alarms': () => `
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <path d="M4 32 L14 22 L22 28 L32 12" />
      <rect x="20" y="26" width="4" height="4" transform="rotate(45 22 28)" fill="currentColor" />
      <path d="M4 38 L40 38" opacity="0.4" stroke-dasharray="1 2" />
    </svg>`,
  'Seamless Integration': () => `
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <circle cx="22" cy="30" r="2.5" fill="currentColor" />
      <path d="M22 30 C 22 22, 22 22, 22 16" opacity="0.4" />
      <path d="M10 30 Q22 6 34 30" />
      <path d="M6 30 Q22 -2 38 30" opacity="0.6" />
    </svg>`,
  'Motor Control': () => `
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <rect x="6" y="6" width="32" height="32" rx="2" />
      <path d="M18 16 L28 22 L18 28 Z" fill="currentColor" opacity="0.85" />
    </svg>`,
  'Triaxial Vibration': () => `
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <path d="M4 22 Q10 12 16 22 T28 22" opacity="0.9" />
      <path d="M10 30 L10 14" opacity="0.6" />
      <path d="M2 38 L22 38 L22 20" opacity="0.6" />
      <path d="M2 38 L14 26" opacity="0.4" stroke-dasharray="1 2" />
    </svg>`,
  'Acoustic Analysis': () => `
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <circle cx="22" cy="22" r="4" fill="currentColor" opacity="0.7" />
      <circle cx="22" cy="22" r="9" stroke-opacity="0.55" />
      <circle cx="22" cy="22" r="15" stroke-opacity="0.3" />
      <circle cx="22" cy="22" r="20" stroke-opacity="0.15" />
    </svg>`,
  'Temperature Trending': () => `
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <path d="M4 34 Q12 28 20 24 T36 14" />
      <line x1="30" y1="34" x2="36" y2="34" stroke-opacity="0.4" stroke-dasharray="1 2" />
      <circle cx="36" cy="14" r="2.5" fill="currentColor" />
    </svg>`,
  'On-Device ML': () => `
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <circle cx="22" cy="22" r="4" fill="currentColor" opacity="0.7" />
      <line x1="6" y1="12" x2="18" y2="20" />
      <line x1="6" y1="32" x2="18" y2="24" />
      <line x1="38" y1="22" x2="26" y2="22" />
      <circle cx="6" cy="12" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="6" cy="32" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="38" cy="22" r="2" fill="currentColor" opacity="0.5" />
    </svg>`,
  'BMS Integration': () => `
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <circle cx="22" cy="30" r="2.5" fill="currentColor" />
      <path d="M22 30 C 22 22, 22 22, 22 16" opacity="0.4" />
      <path d="M10 30 Q22 6 34 30" />
      <path d="M6 30 Q22 -2 38 30" opacity="0.6" />
    </svg>`,
  'Compact & Wireless': () => `
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <ellipse cx="22" cy="20" rx="10" ry="6" />
      <line x1="12" y1="20" x2="12" y2="30" />
      <line x1="32" y1="20" x2="32" y2="30" />
      <path d="M12 30 Q22 36 32 30" />
      <path d="M16 10 Q22 4 28 10" stroke-opacity="0.5" />
      <path d="M12 7 Q22 0 32 7" stroke-opacity="0.3" />
    </svg>`,
};

function getIcon(title) {
  const fn = iconMap[title];
  return fn ? fn() : `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="22" cy="22" r="14" /></svg>`;
}

export function renderFeatures(content) {
  const f = content.sections.find((s) => s.id === 'features');
  if (!f) return;
  const title = document.querySelector('[data-features-title]');
  const body = document.querySelector('[data-features-body]');
  if (title) title.textContent = f.headline;
  if (body) body.textContent = f.body_long;

  const grid = document.getElementById('feature-grid');
  if (!grid) return;
  grid.innerHTML = '';
  content.core_features.forEach((feat, idx) => {
    const card = document.createElement('article');
    card.className = 'feature-card';
    const num = String(idx + 1).padStart(2, '0');
    card.innerHTML = `
      <span class="feature-card__num">${num}</span>
      <div class="feature-card__icon">${getIcon(feat.title)}</div>
      <h3 class="feature-card__title">${feat.title}</h3>
      <p class="feature-card__short">${feat.short_description}</p>
      <p class="feature-card__long">${feat.long_description}</p>
      <button class="feature-card__more" type="button" aria-expanded="false">
        <span class="feature-card__more-sign" aria-hidden="true"></span>
        <span data-label>Read more</span>
      </button>
    `;
    const btn = card.querySelector('.feature-card__more');
    const label = btn.querySelector('[data-label]');
    btn.addEventListener('click', () => {
      const open = card.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      label.textContent = open ? 'Close' : 'Read more';
    });
    grid.appendChild(card);
  });
}

/* ------------------------------------------------------------
   Stats
   ------------------------------------------------------------ */
export function renderStats(content) {
  const s = content.sections.find((s) => s.id === 'stats');
  if (!s) return;
  const title = document.querySelector('[data-stats-title]');
  if (title) title.textContent = s.headline;

  const row = document.getElementById('stat-row');
  if (!row) return;
  row.innerHTML = '';
  content.stats.forEach((stat) => {
    const el = document.createElement('div');
    el.className = 'stat';
    const numeric = parseNumericValue(stat.value);
    el.innerHTML = `
      <div class="stat__value" data-value="${stat.value}" data-numeric="${numeric.numeric}" data-prefix="${numeric.prefix}" data-suffix="${numeric.suffix}" data-original="${stat.value}">${numeric.prefix}0${numeric.suffix}</div>
      <div class="stat__label">${stat.label}</div>
    `;
    row.appendChild(el);
  });
}

function parseNumericValue(str) {
  const match = String(str).match(/^([^\d-]*)([\d,.]+)(.*)$/);
  if (!match) return { prefix: '', numeric: null, suffix: '', raw: str };
  const [, prefix, num, suffix] = match;
  const numeric = parseFloat(num.replace(/,/g, ''));
  if (Number.isNaN(numeric)) return { prefix: '', numeric: null, suffix: '', raw: str };
  return { prefix, numeric, suffix, raw: str };
}

/* ------------------------------------------------------------
   Audience / use cases
   ------------------------------------------------------------ */
export function renderAudience(content) {
  const a = content.sections.find((s) => s.id === 'audience');
  if (!a) return;
  const title = document.querySelector('[data-audience-title]');
  const body = document.querySelector('[data-audience-body]');
  if (title) title.textContent = a.headline;
  if (body) body.textContent = a.body_long;

  const stage = document.getElementById('audience-stage');
  if (!stage) return;
  stage.innerHTML = '';

  content.use_cases.forEach((uc, i) => {
    const slot = document.createElement('div');
    slot.className = 'audience__slot';
    slot.dataset.index = i;
    if (i === 0) slot.classList.add('is-active');
    slot.innerHTML = `
      <div class="audience__sector">
        <span class="audience__sector-num">${String(i + 1).padStart(2, '0')} / ${String(content.use_cases.length).padStart(2, '0')}</span>
        <span>${uc.sector}</span>
      </div>
      <p class="audience__detail">${uc.detail}</p>
    `;
    stage.appendChild(slot);
  });

  const dots = document.createElement('div');
  dots.className = 'audience__dots';
  content.use_cases.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'audience__dot';
    d.type = 'button';
    d.dataset.index = i;
    d.setAttribute('aria-label', `Use case ${i + 1}`);
    if (i === 0) d.classList.add('is-active', 'is-progress');
    dots.appendChild(d);
  });
  stage.appendChild(dots);
}

/* ------------------------------------------------------------
   Closing
   ------------------------------------------------------------ */
export function renderClosing(content) {
  const c = content.sections.find((s) => s.id === 'closing');
  if (!c) return;
  const title = document.querySelector('[data-closing-title]');
  if (title) {
    const words = c.headline.split(/\s+/);
    title.innerHTML = words.map((w, i) => {
      const cls = i === 1 ? 'class="accent"' : '';
      return `<span ${cls}>${w}</span>`;
    }).join(' ');
  }

  const ctaLabel = document.querySelector('[data-cta-label]');
  const ctaBtn = document.getElementById('cta-btn');
  if (ctaLabel) ctaLabel.textContent = content.cta.label;
  if (ctaBtn) ctaBtn.href = content.cta.href;

  const closingLeft = document.querySelector('[data-closing-left]');
  const closingRight = document.querySelector('[data-closing-right]');
  const footerMeta = document.querySelector('[data-footer-meta]');
  if (closingLeft) closingLeft.textContent = `${content.vendor} · ${content.vendor_location}`;
  if (closingRight) closingRight.textContent = content.contact;
  if (footerMeta) footerMeta.textContent = `© 2026 · ${content.vendor}`;
}

/* ------------------------------------------------------------
   Entry — renders all product-page sections
   ------------------------------------------------------------ */
export function renderAll(content) {
  renderNav(content);
  renderHero(content);
  renderRevealCopy(content);
  renderDashboard(content);
  renderFeatures(content);
  renderStats(content);
  renderAudience(content);
  renderClosing(content);
}
