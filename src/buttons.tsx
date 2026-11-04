import { createRoot } from 'react-dom/client';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

const targets = [
  '.header-contact',
  '.hero-actions > .button',
  '.steps .section-heading > .button',
  '.visit-actions > .button',
  '.final-cta .button',
];

for (const selector of targets) {
  const link = document.querySelector<HTMLAnchorElement>(selector);
  if (!link) continue;
  const label = link.childNodes[0]?.textContent?.trim() ?? '';
  const href = link.getAttribute('href') ?? '#';
  const target = link.getAttribute('target') ?? undefined;
  const rel = link.getAttribute('rel') ?? undefined;
  const isLight = link.classList.contains('lime');
  const isOutline = link.classList.contains('outline');
  const className = link.className;
  const mount = document.createElement('span');
  mount.className = `glass-button-mount${selector === '.header-contact' ? ' header-glass-mount' : ''}`;
  link.replaceWith(mount);
  createRoot(mount).render(
    <LiquidButton asChild className={`${className} cat-glass ${isLight ? 'cat-glass-light' : isOutline ? 'cat-glass-outline' : 'cat-glass-green'}`}>
      <a href={href} target={target} rel={rel}>
        <span className="glass-label">{label}</span>
        <span className="glass-arrow" aria-hidden="true">↗</span>
      </a>
    </LiquidButton>
  );
}
