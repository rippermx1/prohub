import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { SpecialtiesService } from '../../services/specialties.service';
import { AuthService } from '../../services/auth.service';
import { LogoutButtonComponent } from '../../components/logout-button/logout-button.component';

interface Service {
  id?: string;
  name: string;
  price: number;
  editing?: boolean;
  pro_id?: string; // Add pro_id field to ensure it's available
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoutButtonComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  sb = inject(SupabaseService);
  router = inject(Router);
  specialtiesService = inject(SpecialtiesService);
  authService = inject(AuthService);
  uid: string | undefined;
  displayName = '';
  bio = '';
  city = '';
  rut = ''; // Add RUT field
  phone = ''; // Add phone field
  avatarUrl: string | null = null;
  previewUrl: string | null = null;
  file?: File;
  saving = false;
  saved = false;

  allSpecialties: string[] = [];
  selectedSpecialty: string = ''; // Changed from array to single string

  hourlyRate: number | null = null;
  services: Service[] = [];
  newService: Service = { name: '', price: 0 };
  constructor() {}

  async ngOnInit() {
    // Load specialties from service
    this.allSpecialties = this.specialtiesService.getAll();

    const user = (await this.sb.supabase.auth.getUser()).data.user;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.uid = user.id;
    const { data } = await this.sb.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (data) {
      this.displayName = data.display_name ?? '';
      this.bio = data.bio ?? '';
      this.city = data.city ?? '';
      this.rut = data.rut ?? ''; // Load RUT from profile
      this.phone = data.phone ?? ''; // Load phone from profile
      this.avatarUrl = data.avatar_url;
      this.hourlyRate = data.hourly_rate;

      // Extract first specialty from array or use empty string
      if (Array.isArray(data.specialties) && data.specialties.length > 0) {
        this.selectedSpecialty = data.specialties[0];
      } else if (typeof data.specialties === 'string') {
        this.selectedSpecialty = data.specialties;
      } else {
        this.selectedSpecialty = '';
      }
    }

    // Fetch services
    const { data: servicesData } = await this.sb.supabase
      .from('services')
      .select('*')
      .eq('pro_id', user.id);

    if (servicesData && servicesData.length > 0) {
      this.services = servicesData;
    }
  }

  onFile(e: Event) {
    const i = e.target as HTMLInputElement;
    if (i.files?.length) {
      this.file = i.files[0];
      this.previewUrl = URL.createObjectURL(this.file);
    }
  }

  // Add method to delete photo
  deletePhoto() {
    this.sb
      .deleteCustomAvatar(this.uid!, this.avatarUrl!)
      .then(() => {
        this.avatarUrl = null; // Clear local avatar URL
        this.file = undefined; // Clear file input
        this.previewUrl = null; // Clear preview URL
      })
      .catch((err) => {
        console.error('Error deleting photo:', err);
        alert('No se pudo eliminar la foto. Intente de nuevo.');
      });
  }

  // Add method to update a service in Supabase
  async updateServiceInDatabase(service: Service): Promise<boolean> {
    if (!this.uid || !service.id) return false;

    try {
      const { error } = await this.sb.supabase
        .from('services')
        .update({
          name: service.name,
          price: service.price,
        })
        .eq('id', service.id)
        .eq('pro_id', this.uid); // Ensure we only update own services

      return !error;
    } catch (e) {
      console.error('Error updating service:', e);
      return false;
    }
  }

  // Add method to delete a service from Supabase
  async deleteServiceFromDatabase(serviceId: string): Promise<boolean> {
    if (!this.uid || !serviceId) return false;

    try {
      const { error } = await this.sb.supabase
        .from('services')
        .delete()
        .eq('id', serviceId)
        .eq('pro_id', this.uid); // Ensure we only delete own services

      return !error;
    } catch (e) {
      console.error('Error deleting service:', e);
      return false;
    }
  }

  // Add method to create a new service in Supabase
  async createServiceInDatabase(service: Service): Promise<string | null> {
    if (!this.uid) return null;

    try {
      const serviceWithProId = {
        ...service,
        pro_id: this.uid,
      };

      const { data, error } = await this.sb.supabase
        .from('services')
        .insert(serviceWithProId)
        .select('id')
        .single();

      if (error || !data) {
        console.error('Error creating service:', error);
        return null;
      }

      return data.id;
    } catch (e) {
      console.error('Error creating service:', e);
      return null;
    }
  }

  addService() {
    if (this.newService.name.trim() && this.newService.price > 0) {
      // Create service in database first
      this.createServiceInDatabase(this.newService).then((serviceId) => {
        if (serviceId) {
          // Add to local array with ID from database
          this.services.push({
            ...this.newService,
            id: serviceId,
            pro_id: this.uid,
            editing: false, // Don't start in edit mode since it's already saved
          });
        } else {
          // Add locally but in edit mode if DB creation failed
          this.services.push({ ...this.newService, editing: true });
          alert('El servicio se guardará cuando guarde todo el perfil.');
        }

        // Reset form
        this.newService = { name: '', price: 0 };
      });
    }
  }

  removeService(index: number) {
    const service = this.services[index];

    // If service has an ID, delete it from the database
    if (service.id) {
      this.deleteServiceFromDatabase(service.id).then((success) => {
        if (!success) {
          alert('No se pudo eliminar el servicio. Intente de nuevo.');
        }

        // Remove from local array regardless
        this.services.splice(index, 1);
      });
    } else {
      // Remove from local array if no ID
      this.services.splice(index, 1);
    }
  }

  // Add method to edit a service
  editService(index: number) {
    // Set editing mode for this service
    this.services[index].editing = true;
  }

  // Logout method
  logout(): void {
    this.authService.signOut();
  }

  // Add method to save edits
  saveServiceEdit(index: number) {
    const service = this.services[index];

    if (service.name.trim() && service.price > 0) {
      if (service.id) {
        // Update existing service in database
        this.updateServiceInDatabase(service).then((success) => {
          if (!success) {
            alert(
              'No se pudo actualizar el servicio. Los cambios se guardarán cuando guarde todo el perfil.'
            );
          }
        });
      } else {
        // Create new service in database
        this.createServiceInDatabase(service).then((serviceId) => {
          if (serviceId) {
            service.id = serviceId;
            service.pro_id = this.uid;
          } else {
            alert('El servicio se guardará cuando guarde todo el perfil.');
          }
        });
      }

      // Turn off editing mode
      service.editing = false;
    } else {
      // If invalid, remove the service
      this.removeService(index);
    }
  }

  // Add method to cancel editing
  cancelServiceEdit(index: number, originalService: Service) {
    // If it's a new service without an ID, remove it
    if (!this.services[index].id) {
      this.removeService(index);
    } else {
      // Reset to original values and exit edit mode
      this.services[index] = { ...originalService, editing: false };
    }
  }

  async save() {
    if (!this.uid) return;
    this.saving = true;
    this.saved = false;
    let avatar_url = this.avatarUrl;
    if (this.file) {
      const path = `${this.uid}/${this.file.name}`;
      await this.sb.supabase.storage
        .from('avatars')
        .upload(path, this.file, { upsert: true });
      avatar_url = this.sb.supabase.storage.from('avatars').getPublicUrl(path)
        .data.publicUrl;
    }

    // Update the specialties to be an array with a single value
    const specialties = this.selectedSpecialty ? [this.selectedSpecialty] : [];

    // Update profile with RUT and phone fields
    const { error } = await this.sb.supabase
      .from('profiles')
      .update({
        display_name: this.displayName,
        bio: this.bio,
        city: this.city,
        rut: this.rut, // Add RUT field
        phone: this.phone, // Add phone field
        specialties: specialties, // Store as array with single value
        avatar_url,
        hourly_rate: this.hourlyRate,
      })
      .eq('id', this.uid);

    if (!error) {
      // Handle services that don't have IDs yet (failed to save individually)
      const unsavedServices = this.services.filter((s) => !s.id);

      if (unsavedServices.length > 0) {
        const servicesWithProId = unsavedServices.map((service) => ({
          ...service,
          pro_id: this.uid,
          editing: undefined, // Remove UI-only property
        }));

        await this.sb.supabase.from('services').insert(servicesWithProId);
      }

      this.saved = true;
      setTimeout(() => this.router.navigate(['/dashboard']), 700);
    }

    this.saving = false;
  }
}
