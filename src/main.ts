import { Router } from '@/router/Router';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const appRouter = new Router('app');

appRouter
  .register({
    path: '/',
    component: () => {
      const pageContent = document.createElement('div');
      pageContent.className = 'space-y-6';

      const badge = new Badge({ text: 'Disponible para proyectos', variant: 'success' });
      const button = new Button({
        label: 'Ver Proyectos',
        variant: 'primary',
        onClick: () => appRouter.navigate('/projects'),
      });

      pageContent.innerHTML = `
        <div class="space-y-4">
          <div id="badge-slot"></div>
          <h1 class="text-4xl font-bold tracking-tight">Software Architect & Frontend Engineer</h1>
          <p class="text-zinc-400 max-w-2xl text-base leading-relaxed">
            Diseño e implemento plataformas web escalables, sistemas de diseño y arquitectura de software limpia.
          </p>
          <div id="button-slot" class="pt-2"></div>
        </div>
      `;

      pageContent.querySelector('#badge-slot')?.appendChild(badge.render());
      pageContent.querySelector('#button-slot')?.appendChild(button.render());

      return new PublicLayout({ content: pageContent }).render();
    },
  })
  .register({
    path: '/admin',
    component: () => {
      const pageContent = document.createElement('div');
      pageContent.innerHTML = `
        <h1 class="text-2xl font-bold tracking-tight mb-2">Dashboard Principal</h1>
        <p class="text-zinc-400 text-sm">Bienvenido al panel de administración de tu plataforma personal.</p>
      `;
      return new AdminLayout({ content: pageContent, activeRoute: '/admin' }).render();
    },
  });

document.addEventListener('DOMContentLoaded', () => {
  appRouter.init();
});