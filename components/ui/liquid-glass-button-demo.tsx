import { LiquidButton } from '@/components/ui/liquid-glass-button';

export default function LiquidGlassButtonDemo() {
  return (
    <LiquidButton className="cat-glass">
      <span className="glass-label">Fale com a Cat Phone</span>
      <span className="glass-arrow" aria-hidden="true">↗</span>
    </LiquidButton>
  );
}
