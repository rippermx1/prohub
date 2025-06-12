import { Component, inject, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpecialtiesService } from '../../services/specialties.service';
import { ChileLocation, LocationsService } from '../../services/locations.service';

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
  specialtiesService = inject(SpecialtiesService);
  locationsService = inject(LocationsService);
    step = signal(0);
  displayName = '';
  city = '';
  cityQuery = '';
  filteredLocations: ChileLocation[] = [];
  showLocationDropdown = false;
  loading = signal(false);
  
  allSpecialties: string[] = [];
  selectedSpecialty: string = ''; // Changed from Set to a single string
  file?: File;
  previewUrl: string | null = null;
    constructor() {
    // Load specialties from service
    this.allSpecialties = this.specialtiesService.getAll();
    this.filteredLocations = this.locationsService.getAll();
  }
  toggle(specialty: string) { 
    // If the specialty is already selected, deselect it
    // Otherwise, set it as the selected specialty
    this.selectedSpecialty = (this.selectedSpecialty === specialty) ? '' : specialty;
  }
    chip(specialty: string) { 
    const isSelected = this.selectedSpecialty === specialty;
    return (isSelected ? 
      'bg-indigo-600 border-indigo-700' : 
      'bg-gray-800 border-gray-700 hover:bg-gray-700') + 
      ' px-4 py-2 rounded-lg text-sm border transition-colors flex items-center gap-2'; 
  }

  disabled() { 
    return (this.step() === 0 && !this.displayName) || 
           (this.step() === 1 && !this.selectedSpecialty); 
  }
  back(){ this.step.update(s=>s-1); }
  next(){ this.step()===2 ? this.save() : this.step.update(s=>s+1); }

  onFile(e:Event){ const i=e.target as HTMLInputElement; if(i.files?.length){this.file=i.files[0]; this.previewUrl=URL.createObjectURL(this.file);} }
  async save(){
    this.loading.set(true);
    
    const uid=(await this.sb.supabase.auth.getUser()).data.user?.id; 
    if(!uid) {
      this.loading.set(false);
      return;
    }
    
    let avatar_url;
    if(this.file){
      const path=`${uid}/${this.file.name}`;
      await this.sb.supabase.storage.from('avatars').upload(path,this.file,{upsert:true});
      avatar_url=this.sb.supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
    }
      await this.sb.supabase.from('profiles').update({
      display_name: this.displayName,
      city: this.city,
      specialties: this.selectedSpecialty ? [this.selectedSpecialty] : [],
      avatar_url
    }).eq('id', uid);
    
    this.loading.set(false);
    this.router.navigate(['/dashboard']);
  }

  // Location search and selection methods
  searchLocations(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.cityQuery = query;
    this.filteredLocations = this.locationsService.search(query);
    this.showLocationDropdown = true;
  }
  
  selectLocation(location: ChileLocation) {
    this.city = location.comuna;
    this.cityQuery = `${location.comuna}, ${location.region}`;
    this.showLocationDropdown = false;
  }
  
  // Allow dropdown to close when clicking outside
  onLocationBlur() {
    // Delay to allow for click events on dropdown items
    setTimeout(() => {
      this.showLocationDropdown = false;
    }, 200);
  }
}
