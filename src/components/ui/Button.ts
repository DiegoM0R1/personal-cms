import { BaseComponent } from '../base/BaseComponent';

export interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: MouseEvent) => void;
  className?: string;
}

export class Button extends BaseComponent<ButtonProps> {
  protected template(): string {
    const {
      label,
      variant = 'primary',
      size = 'md',
      type = 'button',
      disabled = false,
      loading = false,
      className = '',
    } = this.props;

    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
    
    const variants = {
      primary: 'bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500',
      secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 focus:ring-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700',
      outline: 'border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-zinc-500',
      ghost: 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:ring-zinc-500',
      danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const spinner = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;

    return `
      <button 
        type="${type}" 
        class="${baseStyles} ${variants[variant]} ${sizes[size]} ${className}"
        ${disabled || loading ? 'disabled' : ''}
      >
        ${loading ? spinner : ''}
        <span>${label}</span>
      </button>
    `;
  }

  protected onMount(): void {
    if (this.element && this.props.onClick) {
      this.element.addEventListener('click', (e) => this.props.onClick!(e as MouseEvent));
    }
  }
}