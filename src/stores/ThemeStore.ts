import { Store } from './Store';

export type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
}

const STORAGE_KEY = 'personal_cms_theme';

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme;
  if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

class ThemeStoreManager extends Store<ThemeState> {
  constructor() {
    super({ theme: getInitialTheme() });
    this.applyTheme(this.getState().theme);
  }

  public toggleTheme(): void {
    const nextTheme: Theme = this.getState().theme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  public setTheme(theme: Theme): void {
    localStorage.setItem(STORAGE_KEY, theme);
    this.applyTheme(theme);
    this.setState({ theme });
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}

export const themeStore = new ThemeStoreManager();