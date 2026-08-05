import { Store } from './Store';
import { authService } from '@/services/AuthService';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthStoreManager extends Store<AuthState> {
  constructor() {
    super({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,
    });

    this.initSessionListener();
  }

  /**
   * Inicializa la comprobación de sesión y el listener en tiempo real
   */
  private async initSessionListener(): Promise<void> {
    try {
      const session = await authService.getSession();
      this.updateStateFromSession(session);
    } catch {
      this.setState({ isLoading: false });
    }

    authService.onAuthStateChange((_event, session) => {
      this.updateStateFromSession(session);
    });
  }

  private updateStateFromSession(session: Session | null): void {
    if (session && session.user) {
      this.setState({
        user: session.user,
        session,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      this.setState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }

  public async logout(): Promise<void> {
    await authService.logout();
    this.setState({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }
}

export const authStore = new AuthStoreManager();