import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { ArrowUpRight } from 'lucide-react';

export default function LiquidGlassButtonDemo() {
  return (
    <LiquidButton className="cat-glass">
      <span className="glass-label">Fale com a Cat Phone</span>
      <ArrowUpRight className="glass-arrow" aria-hidden="true" size={20} strokeWidth={1.8} />
    </LiquidButton>
  );
}
