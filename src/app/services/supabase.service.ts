import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public supabase: SupabaseClient = createClient(
    environment.supabaseUrl!,
    environment.supabaseAnonKey!,
    { auth: { persistSession: true } }
  );

  constructor() {
    console.log('SUPABASE URL =', environment.supabaseUrl);
  }

  async deleteCustomAvatar(uid: string, avatarUrl?: string) {
    // 1. Elimina el archivo del bucket, si corresponde
    if (avatarUrl) {
      const filename = avatarUrl.split('/').pop();
      if (filename) {
      await this.supabase.storage.from('avatars').remove([`${uid}/${filename}`]);
      }
    }

    // 2. Pone custom_photo_url = null
    await this.supabase
      .from('profiles')
      .update({ custom_photo_url: null })
      .eq('id', uid);
  }

  async uploadAvatar(file: File, uid: string) {
    const { error } = await this.supabase.storage
      .from('avatars')
      .upload(`${uid}.webp`, file, { upsert: true });
    if (error) throw error;
    return this.supabase.storage.from('avatars').getPublicUrl(`${uid}.webp`)
      .data.publicUrl;
  }

  async getAvatar(uid: string) {
    const { data } = await this.supabase.storage
      .from('avatars')
      .getPublicUrl(`${uid}.webp`);
    // if (error) throw error;
    return data.publicUrl;
  }

  /* Sube archivo, devuelve URL pública */
  async uploadDoc(file: File, uid: string) {
    const path = `${uid}/${file.name}`;
    const { error } = await this.supabase.storage
      .from('documents')
      .upload(path, file, { upsert: true });

    if (error) throw error;
    return this.supabase.storage.from('documents').getPublicUrl(path).data
      .publicUrl;
  }

  /* Invoca Edge Function */
  async verifyDoc(uid: string, docUrl: string) {
    const { data, error } = await this.supabase.functions.invoke('verify-doc', {
      body: { user_id: uid, doc_url: docUrl },
    });

    if (error) throw error;
    return data as { ok: boolean };
  }

  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }

  async getSession() {
    return await this.supabase.auth.getSession();
  }

  async getProfile(id: string) {
    return await this.supabase
      .from('profiles')
      .select('display_name, hourly_rate, specialties')
      .eq('id', id)
      .maybeSingle();
  }

  async checkUserExists(id: string) {
    return await this.supabase
      .from('profiles')
      .select('id, display_name, specialties')
      .eq('id', id)
      .maybeSingle();
  }

  async checkRole(id: string) {
    return await this.supabase
      .from('profiles')
      .select('plan')
      .eq('id', id)
      .single();
  }

  async getMetrics(uid: string) {
    /* return await this.supabase
      .from('metrics')
      .select('*')
      .eq('user_id', uid)
      .single(); */
    return await this.supabase
      .rpc('pro_metrics_single', { p_uid: uid })
      .single();
  }
}
