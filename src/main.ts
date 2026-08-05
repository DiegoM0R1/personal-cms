import { Router } from '@/router/Router';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { LoginPage } from '@/pages/admin/LoginPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { AdminProfilePage } from '@/pages/admin/AdminProfilePage';
import { profileRepository } from '@/repositories/SupabaseProfileRepository';
import { authStore } from '@/stores/AuthStore';

const appRouter = new Router('app');

appRouter.setAuthGuard(async () => {
  const state = authStore.getState();
  if (state.isLoading) {
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

appRouter
  .register({
    path: '/',
    component: async () => {
      const pageContent = document.createElement('div');
      pageContent.className = 'space-y-6';

      let profileData = null;
      try {
        profileData = await profileRepository.getProfile();
      } catch {
        console.warn('Incapaz de recuperar el perfil público');
      }

      const name = profileData?.fullName || 'Desarrollador Software';
      const title = profileData?.title || 'Architect & Full Stack Engineer';
      const bio = profileData?.bio || 'Bienvenido a mi plataforma personal.';

      pageContent.innerHTML = `
        <div class="space-y-4">
          <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/50 text-emerald-400 border border-emerald-800/50">
            ${profileData?.location || 'Disponible para proyectos'}
          </div>
          <h1 class="text-4xl font-bold tracking-tight text-zinc-100">${name}</h1>
          <h2 class="text-xl font-medium text-indigo-400">${title}</h2>
          <p class="text-zinc-400 max-w-2xl text-base leading-relaxed">${bio}</p>
        </div>
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
  })
  .register({
    path: '/admin/profile',
    isPrivate: true,
    component: () => {
      const page = new AdminProfilePage();
      return new AdminLayout({ content: page.render(), activeRoute: '/admin/profile' }).render();
    },
  });

document.addEventListener('DOMContentLoaded', () => {
  appRouter.init();
});