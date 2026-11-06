(() => {
  const section = document.querySelector('#colecao');
  if (!section) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const scene = section.closest('.scratch-scene');
  const panel = scene.querySelector('.scratch-panel');
  const overlay = document.createElement('div');
  overlay.className = 'scratch-paper';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" focusable="false">
    <defs><mask id="paper-tear-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
      <rect class="tear-mask-base" fill="white"/>
      <g class="tear-holes" fill="black">
        <path d="M-31-146 -47-107 -45-95 -63-59 -60-46 -78-9 -76 4 -94 45 -94 61 -118 113 -88 74 -83 56 -59 17 -61 4 -39-35 -42-48 -23-89 -26-103 -18-137Z"/>
        <path d="M35-174 13-122 16-107 -8-65 -5-49 -26-7 -23 8 -47 58 -48 76 -74 144 -39 93 -33 72 -7 30 -10 13 15-32 12-48 36-96 32-112 48-161Z"/>
        <path d="M96-126 80-88 83-76 65-40 67-27 48 10 50 24 31 63 28 80 7 123 36 91 43 75 66 42 63 28 84-10 81-25 100-64 97-78 109-115Z"/>
      </g>
    </mask></defs>
    <rect class="tear-paper-sheet" fill="var(--paper)" mask="url(#paper-tear-mask)"/>
  </svg>`;
  panel.append(overlay);
  const svg = overlay.querySelector('svg');
  const holes = overlay.querySelector('.tear-holes');
  const rects = overlay.querySelectorAll('.tear-mask-base, .tear-paper-sheet');
  const ns = 'http://www.w3.org/2000/svg';
  const defs = svg.querySelector('defs');
  const cuts = [...holes.querySelectorAll('path')].map((path, index) => {
    const clip = document.createElementNS(ns, 'clipPath');
    clip.id = `claw-draw-${index}`;
    clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
    const window = document.createElementNS(ns, 'polygon');
    clip.append(window);
    defs.append(clip);
    path.setAttribute('clip-path', `url(#${clip.id})`);
    return window;
  });
  // A light paper edge makes each newly cut line read as a tear.
  const edges = holes.cloneNode(true);
  edges.classList.remove('tear-holes');
  edges.setAttribute('fill', 'none');
  edges.setAttribute('stroke', '#fffef7');
  edges.setAttribute('stroke-width', '1.6');
  edges.setAttribute('opacity', '.8');
  svg.append(edges);
  let distance = 0, width = 0, height = 0, frame = 0;
  let bypass = false;
  const clamp = n => Math.max(0, Math.min(1, n));
  function draw() {
    frame = 0;
    if (motion.matches || bypass) {
      overlay.hidden = true;
      scene.classList.remove('is-scratching');
      return;
    }
    const top = scene.getBoundingClientRect().top;
    // Begin while the first screen leaves, instead of waiting for a blank screen.
    const lead = innerHeight * .55;
    const p = clamp((lead - top) / (lead + distance));
    cuts.forEach((cut, index) => {
      const drawn = clamp((p - index * .025) / .34);
      const starts = [-146, -174, -126], ends = [113, 144, 123];
      const y = starts[index] + (ends[index] - starts[index]) * drawn;
      const x = [-27, 40, 103][index] - drawn * [80, 100, 85][index];
      cut.setAttribute('points', drawn === 0 ? '0,-180 0,-180 0,-180' :
        `-160,-180 160,-180 160,${y - 22} ${x + 16},${y - 22} ${x},${y} ${x - 16},${y - 22} -160,${y - 22}`);
    });
    const zoomProgress = clamp((p - .36) / .61);
    const zoom = Math.exp(zoomProgress * Math.log(180));
    const size = Math.max(.8, Math.min(1.25, width / 1100));
    const sx = size * zoom;
    const sy = size * zoom;
    const anchorY = Math.min(innerHeight, height) * .34;
    const transform = `translate(${width * .5 + 16 * sx} ${anchorY}) scale(${sx} ${sy})`;
    holes.setAttribute('transform', transform);
    edges.setAttribute('transform', transform);
    // Fade paper fibres before the zoom makes them oversized.
    edges.setAttribute('opacity', String(.8 * (1 - clamp(zoomProgress * 4))));
    overlay.hidden = p >= .999;
    overlay.style.opacity = String(1 - clamp((p - .94) / .06));
    scene.classList.toggle('is-scratching', p < 1);
  }
  function layout() {
    distance = Math.round(innerHeight * .4);
    scene.classList.toggle('has-scratch-reveal', !motion.matches && !bypass);
    scene.style.height = motion.matches || bypass ? '' : `${panel.offsetHeight + distance}px`;
    width = panel.clientWidth;
    height = panel.offsetHeight;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    rects.forEach(rect => { rect.setAttribute('width', width); rect.setAttribute('height', height); });
    const mask = overlay.querySelector('mask');
    mask.setAttribute('x', '0'); mask.setAttribute('y', '0');
    mask.setAttribute('width', width); mask.setAttribute('height', height);
    draw();
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
  // Links to products and keyboard focus skip the decorative transition.
  function showProducts(event) {
    if (event?.type === 'focusin' && -scene.getBoundingClientRect().top >= distance) return;
    bypass = true;
    layout();
  }
  section.addEventListener('focusin', showProducts);
  document.querySelectorAll('a[href="#colecao"]').forEach(link => link.addEventListener('click', showProducts));
  if (location.hash === '#colecao') showProducts();
  addEventListener('hashchange', () => {
    if (location.hash === '#colecao') {
      showProducts();
      section.scrollIntoView({behavior:'instant', block:'start'});
    }
  });
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', layout);
  motion.addEventListener('change', layout);
  new ResizeObserver(layout).observe(section);
  layout();
})();
