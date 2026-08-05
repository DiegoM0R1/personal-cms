import { BaseComponent } from '../base/BaseComponent';

export interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

export class Badge extends BaseComponent<BadgeProps> {
  protected template(): string {
    const { text, variant = 'default' } = this.props;

    const styles = {
      default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
      success: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50',
      warning: 'bg-amber-950/50 text-amber-400 border-amber-800/50',
      info: 'bg-indigo-950/50 text-indigo-400 border-indigo-800/50',
    };

    return `
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}">
        ${text}
      </span>
    `;
  }
}