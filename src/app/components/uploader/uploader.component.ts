import { Component, inject, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-uploader',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './uploader.component.html',
  styleUrl: './uploader.component.scss',
})
export class UploaderComponent {
  private sb = inject(SupabaseService);
  loading = signal(false);
  done = signal(false);
  error = signal<string | null>(null);
  file?: File;

  onSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) this.file = input.files[0];
  }

  async start() {
    if (!this.file) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      const uid = '';// (await supabase.auth.getUser()).data.user?.id!;
      const url = await this.sb.uploadDoc(this.file, uid);
      await this.sb.verifyDoc(uid, url);
      this.done.set(true);
    } catch (err: any) {
      this.error.set(err.message ?? 'Error');
    } finally {
      this.loading.set(false);
    }
  }
}
