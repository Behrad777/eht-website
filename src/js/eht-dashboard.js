import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initEhtDashboard(assets) {
  const container = document.getElementById('eht-bms-rows');
  if (!container || !assets) return;

  container.innerHTML = '';

  assets.forEach((asset) => {
    const row = document.createElement('div');
    row.className = `eht-bms__row eht-bms__row--${asset.status}`;
    row.style.opacity = '0';
    row.style.transform = 'translateY(12px)';

    const statusLabel = asset.status === 'good' ? 'Good' : asset.status === 'warning' ? asset.fault : asset.fault || 'Advisory';
    const statusClass = asset.status === 'good' ? 'eht-bms__status--good' : asset.status === 'warning' ? 'eht-bms__status--warn' : 'eht-bms__status--advisory';

    row.innerHTML = `
      <span class="eht-bms__id mono">${asset.id}</span>
      <span class="eht-bms__name">${asset.name}</span>
      <span class="eht-bms__sig eht-bms__sig--${asset.vibration.toLowerCase()}">${asset.vibration}</span>
      <span class="eht-bms__sig eht-bms__sig--${asset.acoustic.toLowerCase()}">${asset.acoustic}</span>
      <span class="eht-bms__sig eht-bms__sig--${asset.temp.toLowerCase()}">${asset.temp}</span>
      <span class="eht-bms__status ${statusClass}">${statusLabel}</span>
    `;

    container.appendChild(row);
  });

  const rows = container.querySelectorAll('.eht-bms__row');

  ScrollTrigger.create({
    trigger: container,
    start: 'top 75%',
    once: true,
    onEnter: () => {
      gsap.to(rows, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.08,
        onComplete: () => {
          const warnRow = container.querySelector('.eht-bms__row--warning');
          if (warnRow) {
            gsap.to(warnRow, {
              backgroundColor: 'rgba(200, 106, 60, 0.07)',
              duration: 0.7,
              repeat: 3,
              yoyo: true,
              ease: 'power2.inOut',
            });
          }
        },
      });
    },
  });
}
