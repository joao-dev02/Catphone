import { createRoot } from 'react-dom/client';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { AnimatedNavFramer } from '@/components/ui/navigation-menu';

const oldNav = document.querySelector('#navigation');
if (oldNav) {
  const mount = document.createElement('div');
  mount.className = 'animated-nav-mount';
  oldNav.replaceWith(mount);
  document.querySelector('.menu')?.remove();
  document.documentElement.classList.add('has-animated-nav');
  createRoot(mount).render(<AnimatedNavFramer />);
}

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
  const className = link.className.split(/\s+/).filter(name => !['dark', 'lime', 'outline'].includes(name)).join(' ');
  const mount = document.createElement('span');
  mount.className = `glass-button-mount${selector === '.header-contact' ? ' header-glass-mount' : ''}`;
  link.replaceWith(mount);
  createRoot(mount).render(
    <LiquidButton asChild className={`${className} cat-glass`}>
      <a href={href} target={target} rel={rel}>
        <span className="glass-label">{label}</span>
        <span className="glass-arrow" aria-hidden="true">↗</span>
      </a>
    </LiquidButton>
  );
}
