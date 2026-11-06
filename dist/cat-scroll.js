// Progressive enhancement: content stays visible without JavaScript or motion.
(() => {
  const section = document.querySelector('#colecao');
  if (!section) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const scene = document.createElement('div');
  scene.className = 'cat-scroll-scene';
  section.before(scene);
  scene.append(section);
  const content = document.createElement('div');
  content.className = 'cat-scroll-content';
  content.append(...section.childNodes);
  section.append(content);
  const cat = document.createElement('div');
  cat.className = 'scroll-cat';
  cat.setAttribute('aria-hidden', 'true');
  cat.innerHTML = `<svg viewBox="0 0 120 84" fill="none" focusable="false">
    <path class="cat-tail" d="M33 42C10 44 7 25 17 15C23 9 28 14 24 21" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>
    <g class="cat-legs-back" stroke="currentColor" stroke-width="8" stroke-linecap="round"><path d="m43 51-8 22h-8M79 51l8 22h8"/></g>
    <ellipse cx="60" cy="44" rx="34" ry="19" fill="currentColor"/>
    <path d="m81 33 1-23 13 10 15-7-1 24c-1 14-28 15-28-4Z" fill="currentColor"/>
    <g class="cat-legs-front" stroke="currentColor" stroke-width="8" stroke-linecap="round"><path d="m44 54 8 19h8M80 53l-5 20h-8"/></g>
    <path d="m106 30 7 3-7 3" fill="var(--lime)"/><circle cx="100" cy="26" r="2" fill="var(--paper)"/>
    <path d="m105 36 12 3m-13 1 10 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;
  section.append(cat);
  let pinned = false, frame = 0, lastProgress = -1, stopTimer;
  let finished = false;
  const clamp = value => Math.max(0, Math.min(1, value));
  function layout() {
    scene.classList.remove('is-pinned');
    scene.style.height = '';
    pinned = !motion.matches && section.offsetHeight < innerHeight - 40 && innerWidth > 800;
    if (pinned) {
      scene.style.height = `${section.offsetHeight + innerHeight * .95}px`;
      scene.classList.add('is-pinned');
    }
    update();
  }
  function update() {
    frame = 0;
    if (motion.matches || finished) {
      scene.classList.remove('is-revealing');
      cat.style.opacity = '0';
      return;
    }
    const bounds = section.getBoundingClientRect();
    const sceneBounds = scene.getBoundingClientRect();
    const progress = pinned
      ? clamp((20 - sceneBounds.top) / (innerHeight * .95))
      : clamp((innerHeight * .85 - bounds.top) / (bounds.height + innerHeight * .35));
    // Small screens retain their normal flow and fully readable content.
    scene.classList.toggle('is-revealing', pinned && progress < 1);
    content.style.setProperty('--cat-reveal', `${(1 - progress) * 100}%`);
    // Follow the visible part of the collection, not edges outside the viewport.
    // The section is taller than many laptop and phone screens.
    const inset = innerWidth <= 800 ? 30 : 50;
    const left = Math.max(inset, bounds.left + 20);
    const right = Math.min(innerWidth - inset, bounds.right - 20);
    const top = Math.max(72, bounds.top + 28);
    const bottom = Math.min(innerHeight - 48, bounds.bottom - 28);
    const w = Math.max(0, right - left), h = Math.max(0, bottom - top);
    const distance = progress * 2 * (w + h);
    let x, y, angle;
    if (distance <= w) { x = distance; y = 0; angle = 0; }
    else if (distance <= w + h) { x = w; y = distance - w; angle = 90; }
    else if (distance <= 2 * w + h) { x = 2 * w + h - distance; y = h; angle = 180; }
    else { x = 0; y = 2 * (w + h) - distance; angle = 270; }
    cat.style.transform = `translate(${left + x}px, ${top + y}px) translate(-50%, -50%) rotate(${angle}deg)`;
    cat.style.opacity = bottom > top && progress > 0 && progress < 1 ? '1' : '0';
    if (progress !== lastProgress) {
      cat.classList.add('is-walking');
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => cat.classList.remove('is-walking'), 140);
    }
    lastProgress = progress;
    if (progress >= 1) {
      finished = true;
      cat.classList.remove('is-walking');
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  // Keyboard navigation must never focus visually concealed controls.
  section.addEventListener('focusin', () => { finished = true; update(); });
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', layout);
  motion.addEventListener('change', layout);
  new ResizeObserver(layout).observe(content);
  layout();
})();
