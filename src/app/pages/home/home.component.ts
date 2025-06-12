import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import { CardComponent } from '../../components/card/card.component';

import { FilterSheetComponent } from '../../components/filter-sheet/filter-sheet.component';
import { FilterResult } from '../../interfaces/filter-result.interface';
import { Professional } from '../../interfaces/professional.interface';
import { ProfessionalsService } from '../../services/professionals.service';
import { AuthService, UserState } from '../../services/auth.service';

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
export class HomeComponent implements OnInit, OnDestroy {
  professionalService = inject(ProfessionalsService);
  authService = inject(AuthService);
  router = inject(Router);
  
  // Stream management
  private destroy$ = new Subject<void>();
  
  // State as BehaviorSubjects (private)
  private professionalsSubject = new BehaviorSubject<Professional[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private activeFiltersSubject = new BehaviorSubject<FilterResult | null>(null);
  
  // Public observables for template
  loading$ = this.loadingSubject.asObservable();
  isProfessional$ = this.authService.isAuthenticated$;
  
  // Filtered professionals based on active filters
  filtered$ = combineLatest([
    this.professionalsSubject,
    this.activeFiltersSubject,
    this.loadingSubject
  ]).pipe(
    map(([professionals, filters, loading]) => {
      if (loading) return [];
      if (!filters) return professionals;
      
      return professionals.filter(p => {
        const cityOk = !filters.city || 
          p.city?.toLowerCase().includes(filters.city.toLowerCase());
        
        const specOk = !filters.specialties.length ||
          filters.specialties.some(s => p.specialties?.includes(s));
        
        const expOk = !filters.experience || 
          this.matchesExperienceFilter(p, filters.experience);
        
        return cityOk && specOk && expOk;
      });
    })
  );
  
  // Helper observables for the UI
  hasActiveFilters$ = this.activeFiltersSubject.pipe(
    map(filters => !!filters && (
      !!filters.city || 
      (filters.specialties && filters.specialties.length > 0) || 
      !!filters.experience
    ))
  );
  
  activeFilterCount$ = this.activeFiltersSubject.pipe(
    map(filters => {
      if (!filters) return 0;
      
      let count = 0;
      if (filters.city) count++;
      if (filters.specialties && filters.specialties.length > 0) count++;
      if (filters.experience) count++;
      return count;
    })
  );
  
  // UI state (not converted to observable since it's a local UI state)
  sheetOpen = false;
  
  constructor() {}
  
  ngOnInit(): void {
    this.checkUserStatus();
    this.fetchProfessionals();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkUserStatus(): void {
    // User state is now handled by the AuthService
    this.authService.userState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        // Just subscribe to ensure state is updated
        console.log('Current user state:', state);
      });
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  fetchProfessionals(): void {
    this.loadingSubject.next(true);
    
    // Using promise-based API with Rx
    this.professionalService.fetch()
      .then(professionals => {
        if (professionals && professionals.length > 0) {
          this.professionalsSubject.next(professionals);
        } else {
          this.professionalsSubject.next([]);
        }
      })
      .catch(error => {
        console.error('Error fetching professionals:', error);
        this.professionalsSubject.next([]);
      })
      .finally(() => {
        this.loadingSubject.next(false);
      });
  }
  
  private matchesExperienceFilter(
    professional: Professional, 
    expFilter: {min: number, max?: number}
  ): boolean {
    // Extract years from experience string or use a default value
    let yearsOfExperience = 0;
    
    if (professional.experience) {
      const match = professional.experience.match(/\\d+/);
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

  clearFilters(): void {
    this.activeFiltersSubject.next(null);
  }

  onClosed(res: FilterResult | null): void {
    this.sheetOpen = false;
    if (res) {
      this.activeFiltersSubject.next(res);
    }
  }
}