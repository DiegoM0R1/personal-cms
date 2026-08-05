import { BaseComponent } from '@/components/base/BaseComponent';
import { Button } from '@/components/ui/Button';
import { authStore } from '@/stores/AuthStore';

export class DashboardPage extends BaseComponent {
  protected template(): string {
    const user = authStore.getState().user;
    const userEmail = user?.email || 'Administrador';

    return `
      <div class="space-y-8">
        <!-- Dashboard Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-zinc-100">Resumen General</h1>
            <p class="text-xs text-zinc-400 mt-1">Sincronizado como <span class="text-indigo-400 font-mono">${userEmail}</span></p>
          </div>
          <div id="logout-btn-slot"></div>
        </div>

        <!-- Quick Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
            <div class="flex items-center justify-between text-zinc-400 text-xs">
              <span>Proyectos Publicados</span>
              <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <div class="text-2xl font-bold text-zinc-100">0</div>
          </div>

          <div class="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
            <div class="flex items-center justify-between text-zinc-400 text-xs">
              <span>Artículos de Blog</span>
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6"></path></svg>
            </div>
            <div class="text-2xl font-bold text-zinc-100">0</div>
          </div>

          <div class="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
            <div class="flex items-center justify-between text-zinc-400 text-xs">
              <span>Mensajes de Contacto</span>
              <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div class="text-2xl font-bold text-zinc-100">0</div>
          </div>
        </div>
      </div>
    `;
  }

  protected onMount(): void {
    const logoutSlot = this.element?.querySelector('#logout-btn-slot');
    if (logoutSlot) {
      const logoutBtn = new Button({
        label: 'Cerrar sesión',
        variant: 'danger',
        size: 'sm',
        onClick: async () => {
          await authStore.logout();
          window.location.href = '/login';
        },
      });
      logoutSlot.appendChild(logoutBtn.render());
    }
  }
}