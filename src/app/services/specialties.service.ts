import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpecialtiesService {
  private readonly specialties: string[] = [
    'Contabilidad',
    'Legal',
    'Marketing',
    'Diseño',
    'TI',
    'Salud',
    'Educación',
    'Finanzas',
    'Recursos Humanos',
    'Consultoría',
    'Arquitectura',
    'Ingeniería',
    'Inmobiliaria',
    'Psicología',
    'Coaching',
    'Fotografía',
    'Video',
    'Traducción',
    'Redacción',
    'E-commerce',
    'Logística',
    'Seguridad',
    'Turismo',
    'Eventos',
    'Deportes',
    'Arte',
    'Cultura',
    'Cuidado de mascotas',
    'Cuidado del hogar',
    'Alimentación',
    'Belleza',
    'Fitness',
    'Música',
    'Tecnología',
    'Ciencia',
    'Transporte',
  ];

  /**
   * Get all available specialties
   */
  getAll(): string[] {
    return [...this.specialties];
  }
  
  /**
   * Get a filtered list of core specialties
   * (Used in profile and onboarding, a smaller subset)
   */
  getCore(): string[] {
    return ['Contabilidad', 'Legal', 'Marketing', 'Diseño', 'TI', 'Salud'];
  }
  
  /**
   * Check if a specialty is valid
   */
  isValid(specialty: string): boolean {
    return this.specialties.includes(specialty);
  }
}
