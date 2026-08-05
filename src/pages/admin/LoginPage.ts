import { BaseComponent } from '@/components/base/BaseComponent';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/AuthService';

export class LoginPage extends BaseComponent {
  private errorMessage: string = '';
  private isLoading: boolean = false;

  protected template(): string {
    return `
      <div class="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-6">
        <div class="w-full max-w-sm space-y-6">
          <div class="space-y-2 text-center">
            <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-zinc-100">Acceso Administrador</h1>
            <p class="text-xs text-zinc-400">Ingresa tus credenciales para gestionar la plataforma</p>
          </div>

          <form id="login-form" class="space-y-4">
            ${
              this.errorMessage
                ? `<div class="p-3 rounded-lg bg-red-950/50 border border-red-800/50 text-red-400 text-xs text-center">${this.errorMessage}</div>`
                : ''
            }

            <div class="space-y-1.5">
              <label for="email" class="text-xs font-medium text-zinc-300">Correo electrónico</label>
              <input 
                type="email" 
                id="email" 
                required 
                placeholder="admin@dominio.com"
                class="w-full px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div class="space-y-1.5">
              <label for="password" class="text-xs font-medium text-zinc-300">Contraseña</label>
              <input 
                type="password" 
                id="password" 
                required 
                placeholder="••••••••••••"
                class="w-full px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div id="submit-btn-slot" class="pt-2"></div>
          </form>

          <div class="text-center">
            <a href="/" class="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">← Volver al sitio público</a>
          </div>
        </div>
      </div>
    `;
  }

  protected onMount(): void {
    const submitSlot = this.element?.querySelector('#submit-btn-slot');
    if (submitSlot) {
      const submitBtn = new Button({
        label: 'Iniciar sesión',
        variant: 'primary',
        type: 'submit',
        loading: this.isLoading,
        className: 'w-full',
      });
      submitSlot.appendChild(submitBtn.render());
    }

    const form = this.element?.querySelector('#login-form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = this.element?.querySelector('#email') as HTMLInputElement;
      const passwordInput = this.element?.querySelector('#password') as HTMLInputElement;

      if (!emailInput?.value || !passwordInput?.value) return;

      this.isLoading = true;
      this.errorMessage = '';
      this.reRender();

      try {
        await authService.login(emailInput.value, passwordInput.value);
        window.location.href = '/admin';
      } catch (err: unknown) {
        this.isLoading = false;
        this.errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
        this.reRender();
      }
    });
  }

  private reRender(): void {
    if (this.element && this.element.parentElement) {
      const parent = this.element.parentElement;
      const newEl = this.render();
      parent.replaceChild(newEl, this.element);
    }
  }
}