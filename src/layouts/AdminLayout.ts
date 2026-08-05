import { BaseComponent } from '../components/base/BaseComponent';

export class AdminLayout extends BaseComponent<{ content: HTMLElement; activeRoute?: string }> {
  protected template(): string {
    const { activeRoute = '/admin' } = this.props;

    const navItems = [
      { path: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { path: '/admin/profile', label: 'Perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      { path: '/admin/projects', label: 'Proyectos', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
      { path: '/admin/blog', label: 'Blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6' },
      { path: '/admin/settings', label: 'Configuración', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ];

    const linksHtml = navItems
      .map((item) => {
        const isActive = activeRoute === item.path;
        const activeClass = isActive
          ? 'bg-indigo-600/10 text-indigo-400 font-medium border-r-2 border-indigo-500'
          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60';

        return `
          <a href="${item.path}" class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${activeClass}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path></svg>
            <span>${item.label}</span>
          </a>
        `;
      })
      .join('');

    return `
      <div class="min-h-screen flex bg-zinc-950 text-zinc-100">
        <!-- Sidebar -->
        <aside class="w-64 border-r border-zinc-800/80 bg-zinc-950 flex flex-col justify-between">
          <div>
            <div class="h-16 px-6 flex items-center border-b border-zinc-800/80">
              <span class="font-semibold tracking-tight text-sm text-zinc-200">CMS Console</span>
            </div>
            <nav class="py-4 space-y-1">
              ${linksHtml}
            </nav>
          </div>

          <div class="p-4 border-t border-zinc-800/80">
            <a href="/" class="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              <span>Volver al sitio público</span>
            </a>
          </div>
        </aside>

        <!-- Admin Content Area -->
        <div class="flex-1 flex flex-col min-w-0">
          <header class="h-16 border-b border-zinc-800/80 px-8 flex items-center justify-between bg-zinc-950/50 backdrop-blur">
            <div class="text-xs font-mono text-zinc-400">Admin Panel</div>
            <div class="flex items-center gap-3">
              <div class="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-xs font-medium text-indigo-300">
                A
              </div>
            </div>
          </header>

          <main id="admin-main-content" class="flex-1 p-8 overflow-y-auto"></main>
        </div>
      </div>
    `;
  }

  protected onMount(): void {
    const slot = this.element?.querySelector('#admin-main-content');
    if (slot && this.props.content) {
      slot.appendChild(this.props.content);
    }
  }
}