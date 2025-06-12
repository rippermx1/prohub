import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterResult } from '../../interfaces/filter-result.interface';
import { SpecialtiesService } from '../../services/specialties.service';

interface ExperienceLevel {
  id: string;
  label: string;
  min: number;
  max?: number;
}

@Component({
  selector: 'app-filter-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './filter-sheet.component.html',
  styleUrl: './filter-sheet.component.scss',
})
export class FilterSheetComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<FilterResult | null>();

  specialtiesService = inject(SpecialtiesService);
  specialties: string[] = [];
  
  experienceLevels: ExperienceLevel[] = [
    { id: 'junior', label: '< 2 años', min: 0, max: 2 },
    { id: 'mid', label: '2-5 años', min: 2, max: 5 },
    { id: 'senior', label: '5-10 años', min: 5, max: 10 },
    { id: 'expert', label: '10+ años', min: 10 }
  ];
  
  private selected = new Set<string>();
  private selectedExperience: ExperienceLevel | null = null;
  cityFilter = '';
  animateIn = true;

  constructor() {
    // Load specialties from service
    this.specialties = this.specialtiesService.getAll();
  }

  toggle(option: string) {
    this.selected.has(option)
      ? this.selected.delete(option)
      : this.selected.add(option);
  }

  toggleExperience(experience: ExperienceLevel) {
    this.selectedExperience = 
      this.selectedExperience?.id === experience.id ? null : experience;
  }

  chipClass(opt: string) {
    const active = this.selected.has(opt);
    return (
      'px-3 py-1 rounded-full text-xs font-medium transition ' +
      (active
        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
        : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-50')
    );
  }
  
  experienceClass(exp: ExperienceLevel) {
    const active = this.selectedExperience?.id === exp.id;
    return (
      'py-2 px-3 rounded-lg text-sm font-medium transition ' +
      (active
        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
        : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600')
    );
  }

  resetFilters() {
    this.selected.clear();
    this.selectedExperience = null;
    this.cityFilter = '';
  }

  applyFilters() {
    this.close({
      specialties: Array.from(this.selected),
      city: this.cityFilter.trim(),
      experience: this.selectedExperience ? {
        min: this.selectedExperience.min,
        max: this.selectedExperience.max
      } : null
    });
  }

  close(result: FilterResult | null = null) {
    this.animateIn = false;
    setTimeout(() => {
      this.open = false;
      this.closed.emit(result);
      this.animateIn = true;
    }, 300);
  }
}
