import { BaseComponent } from '../components/base/BaseComponent';
import { themeStore } from '../stores/ThemeStore';

export class PublicLayout extends BaseComponent<{ content: HTMLElement }> {
  private unsubscribeTheme?: () => void;

  protected template(): string {
    return `
      <div class="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        <!-- Main Navbar -->
        <header class="sticky top-0 z-40 w-full backdrop-blur-md bg-white/75 dark:bg-zinc-950/75 border-b border-zinc-200 dark:border-zinc-800/80">
          <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" class="font-semibold tracking-tight text-lg flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>DevPortfolio</span>
            </a>

            <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <a href="/" class="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Inicio</a>
              <a href="/projects" class="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Proyectos</a>
              <a href="/blog" class="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Blog</a>
              <a href="/contact" class="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Contacto</a>
            </nav>

            <div class="flex items-center gap-3">
              <button id="theme-toggle-btn" aria-label="Cambiar tema" class="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-all">
                <svg id="theme-icon-sun" class="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                <svg id="theme-icon-moon" class="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>
              </button>
              <a href="/login" class="text-xs font-mono px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all">Admin</a>
            </div>
          </div>
        </header>

        <!-- Dynamic Content Slot -->
        <main id="public-main-content" class="flex-1 max-w-5xl w-full mx-auto px-6 py-10"></main>

        <!-- Footer -->
        <footer class="border-t border-zinc-200 dark:border-zinc-800/80 py-8 text-xs text-zinc-500 text-center">
          <div class="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© ${new Date().getFullYear()} Personal CMS. Todos los derechos reservados.</p>
            <div class="flex gap-4">
              <a href="https://github.com" target="_blank" class="hover:underline">GitHub</a>
              <a href="https://linkedin.com" target="_blank" class="hover:underline">LinkedIn</a>
            </div>
          </div>
        </footer>
      </div>
    `;
  }

  protected onMount(): void {
    const slot = this.element?.querySelector('#public-main-content');
    if (slot && this.props.content) {
      slot.appendChild(this.props.content);
    }

    const toggleBtn = this.element?.querySelector('#theme-toggle-btn');
    toggleBtn?.addEventListener('click', () => themeStore.toggleTheme());
  }

  public destroy(): void {
    if (this.unsubscribeTheme) this.unsubscribeTheme();
    super.destroy();
  }
}