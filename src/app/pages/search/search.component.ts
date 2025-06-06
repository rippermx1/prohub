import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4 pt-6 min-h-screen bg-white dark:bg-gray-900">
      <h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Búsqueda</h1>
      <p class="text-gray-600 dark:text-gray-300">Aquí podrás buscar profesionales por nombre, especialidad o ubicación.</p>
      <!-- Search functionality will be implemented here -->
    </div>
  `,
  styles: []
})
export class SearchComponent {}
