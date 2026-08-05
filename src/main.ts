import { Router } from '@/router/Router';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { LoginPage } from '@/pages/admin/LoginPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { authStore } from '@/stores/AuthStore';

const appRouter = new Router('app');

// Configuración del AuthGuard
appRouter.setAuthGuard(async () => {
  const state = authStore.getState();
  if (state.isLoading) {
    // Esperar a la resolución de sesión inicial si está en carga
    await new Promise((resolve) => {
      const unsubscribe = authStore.subscribe((s) => {
        if (!s.isLoading) {
          unsubscribe();
          resolve(true);
        }
      });
    });
  }
  return authStore.getState().isAuthenticated;
});

// Registro de Rutas
appRouter
  .register({
    path: '/',
    component: () => {
      const pageContent = document.createElement('div');
      pageContent.className = 'space-y-4';
      pageContent.innerHTML = `
        <h1 class="text-4xl font-bold tracking-tight">Software Architect & Lead Engineer</h1>
        <p class="text-zinc-400">Plataforma personal y CMS administrable.</p>
      `;
      return new PublicLayout({ content: pageContent }).render();
    },
  })
  .register({
    path: '/login',
    component: () => new LoginPage().render(),
  })
  .register({
    path: '/admin',
    isPrivate: true,
    component: () => {
      const page = new DashboardPage();
      return new AdminLayout({ content: page.render(), activeRoute: '/admin' }).render();
    },
  });

document.addEventListener('DOMContentLoaded', () => {
  appRouter.init();
});