export interface Route {
  path: string;
  component: () => Promise<HTMLElement> | HTMLElement;
  isPrivate?: boolean;
}

export class Router {
  private routes: Route[] = [];
  private rootElement: HTMLElement;
  private authGuard?: () => Promise<boolean>;

  constructor(rootElementId: string) {
    const el = document.getElementById(rootElementId);
    if (!el) throw new Error(`[Router] No se encontró el elemento con ID: ${rootElementId}`);
    this.rootElement = el;

    window.addEventListener('popstate', () => this.handleRoute());
    document.addEventListener('click', (e) => this.handleLinkClick(e));
  }

  public register(route: Route): this {
    this.routes.push(route);
    return this;
  }

  public setAuthGuard(guard: () => Promise<boolean>): this {
    this.authGuard = guard;
    return this;
  }

  public navigate(path: string): void {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  private async handleRoute(): Promise<void> {
    const path = window.location.pathname;
    let route = this.routes.find((r) => r.path === path);

    // Fallback 404
    if (!route) {
      route = this.routes.find((r) => r.path === '/404') || {
        path: '/404',
        component: () => {
          const el = document.createElement('div');
          el.className = 'p-8 text-center';
          el.innerHTML = '<h1 class="text-2xl font-bold">404 - Página No Encontrada</h1>';
          return el;
        },
      };
    }

    if (route.isPrivate && this.authGuard) {
      const isAuthenticated = await this.authGuard();
      if (!isAuthenticated) {
        this.navigate('/login');
        return;
      }
    }

    this.rootElement.innerHTML = '';
    const componentInstance = await route.component();
    this.rootElement.appendChild(componentInstance);
  }

  private handleLinkClick(e: MouseEvent): void {
    const target = (e.target as HTMLElement).closest('a');
    if (target && target.getAttribute('href')?.startsWith('/')) {
      e.preventDefault();
      const href = target.getAttribute('href')!;
      this.navigate(href);
    }
  }

  public init(): void {
    this.handleRoute();
  }
}