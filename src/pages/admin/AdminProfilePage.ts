import { BaseComponent } from '@/components/base/BaseComponent';
import { Button } from '@/components/ui/Button';
import { profileRepository } from '@/repositories/SupabaseProfileRepository';
import { Profile } from '@/domain/models/Profile';

export class AdminProfilePage extends BaseComponent {
  private profile: Profile | null = null;
  private isLoading: boolean = true;
  private isSaving: boolean = false;
  private feedbackMessage: { text: string; type: 'success' | 'error' } | null = null;

  protected template(): string {
    if (this.isLoading) {
      return `
        <div class="flex items-center justify-center py-12 text-zinc-400 text-sm">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Cargando datos del perfil...
        </div>
      `;
    }

    const p = this.profile || {
      fullName: '',
      title: '',
      bio: '',
      avatarUrl: '',
      bannerUrl: '',
      cvUrl: '',
      location: '',
      contactEmail: '',
      socialLinks: { github: '', linkedin: '', twitter: '' },
    };

    return `
      <div class="max-w-3xl space-y-6">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-zinc-100">Perfil Profesional</h1>
          <p class="text-xs text-zinc-400 mt-1">Gestiona la información pública de tu marca personal.</p>
        </div>

        ${
          this.feedbackMessage
            ? `<div class="p-4 rounded-lg text-xs font-medium ${
                this.feedbackMessage.type === 'success'
                  ? 'bg-emerald-950/50 border border-emerald-800/50 text-emerald-400'
                  : 'bg-red-950/50 border border-red-800/50 text-red-400'
              }">
                ${this.feedbackMessage.text}
              </div>`
            : ''
        }

        <form id="profile-form" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-zinc-300">Nombre Completo *</label>
              <input type="text" id="fullName" required value="${p.fullName}" class="w-full px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-medium text-zinc-300">Cargo / Título Profesional *</label>
              <input type="text" id="title" required value="${p.title}" placeholder="Ej. Senior Software Architect" class="w-full px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-zinc-300">Biografía *</label>
            <textarea id="bio" rows="4" required class="w-full px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none">${p.bio}</textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-zinc-300">Ubicación</label>
              <input type="text" id="location" value="${p.location || ''}" placeholder="Ej. Lima, Perú / Remoto" class="w-full px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-medium text-zinc-300">Correo de Contacto Público</label>
              <input type="email" id="contactEmail" value="${p.contactEmail || ''}" placeholder="contacto@tu-dominio.com" class="w-full px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
          </div>

          <div class="border-t border-zinc-800 pt-4 space-y-4">
            <h3 class="text-sm font-semibold text-zinc-200">Enlaces y Redes Sociales</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-zinc-400">GitHub URL</label>
                <input type="url" id="github" value="${p.socialLinks?.github || ''}" placeholder="https://github.com/usuario" class="w-full px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-medium text-zinc-400">LinkedIn URL</label>
                <input type="url" id="linkedin" value="${p.socialLinks?.linkedin || ''}" placeholder="https://linkedin.com/in/usuario" class="w-full px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
            </div>
          </div>

          <div id="save-btn-slot" class="pt-2"></div>
        </form>
      </div>
    `;
  }

  protected async onMount(): Promise<void> {
    if (this.isLoading) {
      try {
        this.profile = await profileRepository.getProfile();
      } catch (e: unknown) {
        this.feedbackMessage = { text: 'Error al cargar perfil inicial.', type: 'error' };
      } finally {
        this.isLoading = false;
        this.reRender();
        return;
      }
    }

    const saveSlot = this.element?.querySelector('#save-btn-slot');
    if (saveSlot) {
      const saveBtn = new Button({
        label: 'Guardar Cambios',
        variant: 'primary',
        type: 'submit',
        loading: this.isSaving,
      });
      saveSlot.appendChild(saveBtn.render());
    }

    const form = this.element?.querySelector('#profile-form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleSave();
    });
  }

  private async handleSave(): Promise<void> {
    const getVal = (id: string) => (this.element?.querySelector(`#${id}`) as HTMLInputElement)?.value || '';

    const updatedData: Profile = {
      id: this.profile?.id,
      fullName: getVal('fullName'),
      title: getVal('title'),
      bio: getVal('bio'),
      location: getVal('location'),
      contactEmail: getVal('contactEmail'),
      socialLinks: {
        github: getVal('github'),
        linkedin: getVal('linkedin'),
      },
    };

    this.isSaving = true;
    this.feedbackMessage = null;
    this.reRender();

    try {
      this.profile = await profileRepository.upsertProfile(updatedData);
      this.feedbackMessage = { text: 'Perfil actualizado exitosamente.', type: 'success' };
    } catch (err: unknown) {
      this.feedbackMessage = {
        text: err instanceof Error ? err.message : 'Error al guardar.',
        type: 'error',
      };
    } finally {
      this.isSaving = false;
      this.reRender();
    }
  }

  private reRender(): void {
    if (this.element && this.element.parentElement) {
      const parent = this.element.parentElement;
      const newEl = this.render();
      parent.replaceChild(newEl, this.element);
    }
  }
}