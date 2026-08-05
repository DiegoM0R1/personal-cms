import { supabase } from '@/config/supabase';
import { IProfileRepository } from '@/domain/repositories/IProfileRepository';
import { Profile } from '@/domain/models/Profile';

export class SupabaseProfileRepository implements IProfileRepository {
  public async getProfile(): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[ProfileRepository] Error al obtener el perfil:', error.message);
      throw new Error('Error al cargar la información del perfil.');
    }

    if (!data) return null;

    return this.mapToDomain(data);
  }

  public async upsertProfile(profile: Profile): Promise<Profile> {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) throw new Error('No hay sesión activa para realizar esta acción.');

    const payload = {
      user_id: session.user.id,
      full_name: profile.fullName,
      title: profile.title,
      bio: profile.bio,
      avatar_url: profile.avatarUrl || null,
      banner_url: profile.bannerUrl || null,
      cv_url: profile.cvUrl || null,
      location: profile.location || null,
      contact_email: profile.contactEmail || null,
      social_links: profile.socialLinks || {},
      updated_at: new Date().toISOString(),
    };

    // Si existe ID actualizamos, si no, insertamos
    const { data, error } = profile.id
      ? await supabase.from('profiles').update(payload).eq('id', profile.id).select().single()
      : await supabase.from('profiles').insert(payload).select().single();

    if (error) {
      console.error('[ProfileRepository] Error al guardar el perfil:', error.message);
      throw new Error('Error al guardar los cambios del perfil.');
    }

    return this.mapToDomain(data);
  }

  private mapToDomain(raw: Record<string, unknown>): Profile {
    return {
      id: raw.id as string,
      userId: raw.user_id as string,
      fullName: raw.full_name as string,
      title: raw.title as string,
      bio: raw.bio as string,
      avatarUrl: (raw.avatar_url as string) || '',
      bannerUrl: (raw.banner_url as string) || '',
      cvUrl: (raw.cv_url as string) || '',
      location: (raw.location as string) || '',
      contactEmail: (raw.contact_email as string) || '',
      socialLinks: (raw.social_links as Profile['socialLinks']) || {},
      createdAt: raw.created_at as string,
      updatedAt: raw.updated_at as string,
    };
  }
}

export const profileRepository = new SupabaseProfileRepository();