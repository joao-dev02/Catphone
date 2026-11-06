(() => {
  document.querySelectorAll('.store-video').forEach(video => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const sync = () => {
      if (!visible || document.hidden) { video.pause(); return; }
      // Data saver and reduced motion retain manual playback via native controls.
      if (!motion.matches && !navigator.connection?.saveData) video.play().catch(() => {});
    };
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      sync();
    }, {threshold:.1}).observe(video);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', () => { video.pause(); sync(); });
  });
})();
