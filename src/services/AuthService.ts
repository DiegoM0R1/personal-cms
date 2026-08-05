import { supabase } from '@/config/supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export class AuthService {
  /**
   * Inicia sesión con correo y contraseña
   */
  public async login(email: string, pass: string): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { user: data.user, session: data.session };
  }

  /**
   * Cierra la sesión activa del usuario
   */
  public async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Obtiene la sesión actual almacenada
   */
  public async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return null;
    return data.session;
  }

  /**
   * Escucha cambios en el estado de autenticación (login, logout, refresh token)
   */
  public onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();