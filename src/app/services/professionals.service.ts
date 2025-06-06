import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Professional, ProfessionalFilters } from '../interfaces/professional.interface';

export interface ServicePrice {
  name: string;
  price: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfessionalsService {
  sb = inject(SupabaseService);
  results = signal<Professional[] | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {}

  async fetch(filters: ProfessionalFilters = {}): Promise<Professional[]> {
    this.loading.set(true);
    this.error.set(null);

    // Include related services from the "services" table
    let query = this.sb.supabase
      .from('profiles')
      .select(
        `id, display_name, city, bio, specialties, hourly_rate, avatar_url, verified, rating, website, 
         services (id, name, price)`
      );

    // Dynamic filters
    if (filters.city) query = query.eq('city', filters.city);

    if (filters.specialties?.length) {
      // Array filter: specialties @> '{contabilidad,impuestos}'
      query = query.contains('specialties', filters.specialties);
    }

    if (filters.minRate !== undefined)
      query = query.gte('hourly_rate', filters.minRate);
    if (filters.maxRate !== undefined)
      query = query.lte('hourly_rate', filters.maxRate);

    if (filters.onlyVerified) query = query.eq('verified', true);

    if (filters.search) {
      query = query.or(
        `display_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`
      );
    }

    query = query.order('rating', { ascending: false });

    const { data, error } = await query;

    if (error) {
      this.error.set(error.message);
      this.loading.set(false);
      throw error;
    }

    this.results.set(data as Professional[]);
    this.loading.set(false);
    return data as Professional[];
  }

  /**
   * Fetch services for a specific professional
   */
  async fetchProfessionalServices(proId: string): Promise<ServicePrice[]> {
    try {
      const { data, error } = await this.sb.supabase
        .from('services')
        .select('*')
        .eq('pro_id', proId);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        console.log('Real services loaded:', data.length);
        return data.map((service) => ({
          name: service.name,
          price: `$${service.price.toLocaleString('es-CL')}`,
          description: service.description,
        }));
      }

      // Return empty array if no services found
      return [];
    } catch (error) {
      console.error('Error fetching professional services:', error);
      return [];
    }
  }

  /**
   * Generate mock services for a professional based on their specialty and hourly rate
   */
  generateMockServices(professional: Professional): ServicePrice[] {
    const baseServices = this.getBaseServicesForSpecialties(
      professional.specialties || []
    );
    const hourlyRate = professional?.hourly_rate || 25000;

    const mockServices = baseServices.map((serviceName, index) => {
      const priceMultipliers = [0.8, 1.0, 1.2, 1.5, 0.7];
      const price = Math.round(
        hourlyRate * priceMultipliers[index % priceMultipliers.length]
      );

      return {
        name: serviceName,
        price: `$${price.toLocaleString('es-CL')}`,
        description: this.getRandomServiceDescription(serviceName),
      };
    });

    console.log('Generated mock services:', mockServices.length);
    return mockServices;
  }

  /**
   * Get appropriate services based on professional specialties
   */
  private getBaseServicesForSpecialties(specialties: string[]): string[] {
    if (!specialties || specialties.length === 0) {
      return [
        'Consulta inicial',
        'Asesoría básica',
        'Asesoría completa',
        'Proyecto personalizado',
        'Seguimiento mensual',
      ];
    }

    const specialty = specialties[0]; // Use first specialty

    const servicesBySpecialty: { [key: string]: string[] } = {
      Contabilidad: [
        'Contabilidad mensual',
        'Declaración de impuestos',
        'Auditoría contable',
        'Planificación fiscal',
      ],
      Legal: [
        'Asesoría legal',
        'Redacción de contratos',
        'Representación jurídica',
        'Consulta legal',
      ],
      Marketing: [
        'Estrategia de marketing',
        'Gestión de redes sociales',
        'Campañas publicitarias',
        'Análisis de mercado',
      ],
      Diseño: [
        'Diseño gráfico',
        'Diseño web',
        'Branding',
        'Diseño UX/UI',
      ],
      TI: [
        'Desarrollo web',
        'Soporte técnico',
        'Consultoría IT',
        'Desarrollo de aplicaciones',
      ],
      Salud: [
        'Consulta médica',
        'Terapia',
        'Evaluación',
        'Plan de tratamiento',
      ],
      default: [
        'Consultoría',
        'Asesoría personalizada',
        'Proyectos a medida',
        'Soluciones integrales',
      ],
    };

    return servicesBySpecialty[specialty] || servicesBySpecialty['default'];
  }

  /**
   * Generate a random description for a service
   */
  private getRandomServiceDescription(serviceName: string): string {
    const descriptions = [
      `${serviceName} con atención personalizada`,
      'Incluye primera consulta y seguimiento',
      'Servicio profesional con garantía de satisfacción',
      'Incluye documentación completa',
      'Adaptado a las necesidades de cada cliente',
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }
}
