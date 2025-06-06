import { Component, inject, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-onboarding-wizard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './onboarding-wizard.component.html',
  styleUrl: './onboarding-wizard.component.scss'
})
export class OnboardingWizardComponent {
  sb = inject(SupabaseService);
  router = inject(Router);
  step = signal(0);
  displayName = '';
  city = '';
  allSpecialties = ['Contabilidad','Legal','Marketing','Diseño','TI','Salud'];
  selected = new Set<string>();
  file?: File;
  previewUrl: string | null = null;

  toggle(o:string){ this.selected.has(o)?this.selected.delete(o):this.selected.add(o); }
  chip(o:string){ return (this.selected.has(o)?'bg-indigo-600':'bg-gray-700')+' px-3 py-1 rounded-full text-xs'; }

  disabled(){ return (this.step()==0 && !this.displayName) || (this.step()==1 && this.selected.size===0); }
  back(){ this.step.update(s=>s-1); }
  next(){ this.step()===2 ? this.save() : this.step.update(s=>s+1); }

  onFile(e:Event){ const i=e.target as HTMLInputElement; if(i.files?.length){this.file=i.files[0]; this.previewUrl=URL.createObjectURL(this.file);} }

  async save(){
    const uid=(await this.sb.supabase.auth.getUser()).data.user?.id; if(!uid) return;
    let avatar_url;
    if(this.file){
      const path=`${uid}/${this.file.name}`;
      await this.sb.supabase.storage.from('avatars').upload(path,this.file,{upsert:true});
      avatar_url=this.sb.supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
    }
    await this.sb.supabase.from('profiles').update({
      display_name:this.displayName,
      city:this.city,
      specialties:Array.from(this.selected),
      avatar_url
    }).eq('id',uid);
    this.router.navigate(['/dashboard']);
  }
}
