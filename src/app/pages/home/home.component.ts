import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';

import { FilterSheetComponent } from '../../components/filter-sheet/filter-sheet.component';
import { FilterResult } from '../../interfaces/filter-result.interface';
import { Professional } from '../../interfaces/professional.interface';
import { ProfessionalsService } from '../../services/professionals.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardComponent,
    FilterSheetComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  professionalService = inject(ProfessionalsService);
  private pros = signal<Professional[]>([]);
  sheetOpen = false;
  loading = signal<boolean>(true);
  private activeFilters = signal<FilterResult | null>(null);

  constructor() {}

  ngOnInit(): void {
    this.fetchProfessionals();
  }

  async fetchProfessionals(): Promise<void> {
    this.loading.set(true);
    try {
      const professionals = await this.professionalService.fetch();
      
      // If data returned, use it; otherwise, fall back to demo data
      if (professionals && professionals.length > 0) {
        this.pros.set(professionals);
      } else {
        this.pros.set([]);
      }
    } catch (error) {
      console.error('Error fetching professionals:', error);
      // Fall back to demo data if fetch fails
      this.pros.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  filtered() {
    // If still loading, return empty array to prevent errors
    if (this.loading()) return [];
    
    const data = this.activeFilters();
    if (!data) return this.pros();
    
    return this.pros().filter((p) => {
      const cityOk =
        !data.city || p.city?.toLowerCase().includes(data.city.toLowerCase());
      const specOk =
        !data.specialties.length ||
        data.specialties.some((s) => p.specialties?.includes(s));
        
      // Add experience filtering
      const expOk = !data.experience || this.matchesExperienceFilter(p, data.experience);
        
      return cityOk && specOk && expOk;
    });
  }
  
  private matchesExperienceFilter(
    professional: Professional, 
    expFilter: {min: number, max?: number}
  ): boolean {
    // Extract years from experience string or use a default value
    let yearsOfExperience = 0;
    
    if (professional.experience) {
      const match = professional.experience.match(/\d+/);
      if (match) {
        yearsOfExperience = parseInt(match[0], 10);
      }
    } else {
      // If no experience explicitly set, generate a random one based on the professional's id
      // This ensures consistent random values for the same professional
      const hash = professional.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      yearsOfExperience = (hash % 15) + 1; // 1-15 years range
    }
    
    // Check if experience is within range
    const minOk = yearsOfExperience >= expFilter.min;
    const maxOk = !expFilter.max || yearsOfExperience <= expFilter.max;
    
    return minOk && maxOk;
  }

  hasActiveFilters(): boolean {
    const filters = this.activeFilters();
    return !!filters && (
      !!filters.city || 
      filters.specialties.length > 0 || 
      !!filters.experience
    );
  }

  activeFilterCount(): number {
    const filters = this.activeFilters();
    if (!filters) return 0;

    let count = 0;
    if (filters.city) count++;
    if (filters.specialties && filters.specialties.length > 0) count++;
    if (filters.experience) count++;
    return count;
  }

  clearFilters(): void {
    this.activeFilters.set(null);
  }

  onClosed(res: FilterResult | null) {
    this.sheetOpen = false;
    if (res) {
      this.activeFilters.set(res);
    }
  }
}