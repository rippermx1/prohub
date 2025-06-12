import { Injectable } from '@angular/core';

export interface ChileLocation {
  comuna: string;
  region: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private readonly locations: ChileLocation[] = [
    { comuna: 'Santiago', region: 'Región Metropolitana' },
    { comuna: 'Providencia', region: 'Región Metropolitana' },
    { comuna: 'Las Condes', region: 'Región Metropolitana' },
    { comuna: 'Ñuñoa', region: 'Región Metropolitana' },
    { comuna: 'La Florida', region: 'Región Metropolitana' },
    { comuna: 'Maipú', region: 'Región Metropolitana' },
    { comuna: 'Vitacura', region: 'Región Metropolitana' },
    { comuna: 'Puente Alto', region: 'Región Metropolitana' },
    { comuna: 'La Reina', region: 'Región Metropolitana' },
    { comuna: 'Lo Barnechea', region: 'Región Metropolitana' },
    { comuna: 'Viña del Mar', region: 'Valparaíso' },
    { comuna: 'Valparaíso', region: 'Valparaíso' },
    { comuna: 'Concón', region: 'Valparaíso' },
    { comuna: 'Quilpué', region: 'Valparaíso' },
    { comuna: 'Villa Alemana', region: 'Valparaíso' },
    { comuna: 'Concepción', region: 'Biobío' },
    { comuna: 'Talcahuano', region: 'Biobío' },
    { comuna: 'Chiguayante', region: 'Biobío' },
    { comuna: 'San Pedro de la Paz', region: 'Biobío' },
    { comuna: 'Hualpén', region: 'Biobío' },
    { comuna: 'La Serena', region: 'Coquimbo' },
    { comuna: 'Coquimbo', region: 'Coquimbo' },
    { comuna: 'Antofagasta', region: 'Antofagasta' },
    { comuna: 'Calama', region: 'Antofagasta' },
    { comuna: 'Temuco', region: 'La Araucanía' },
    { comuna: 'Padre Las Casas', region: 'La Araucanía' },
    { comuna: 'Puerto Montt', region: 'Los Lagos' },
    { comuna: 'Puerto Varas', region: 'Los Lagos' },
    { comuna: 'Iquique', region: 'Tarapacá' },
    { comuna: 'Alto Hospicio', region: 'Tarapacá' },
    { comuna: 'Arica', region: 'Arica y Parinacota' },
    { comuna: 'Rancagua', region: 'O\'Higgins' },
    { comuna: 'Machalí', region: 'O\'Higgins' },
    { comuna: 'Talca', region: 'Maule' },
    { comuna: 'Curicó', region: 'Maule' },
    { comuna: 'Linares', region: 'Maule' },
    { comuna: 'Punta Arenas', region: 'Magallanes' },
    { comuna: 'Coyhaique', region: 'Aysén' },
    { comuna: 'Valdivia', region: 'Los Ríos' },
    { comuna: 'Osorno', region: 'Los Lagos' }
  ];

  constructor() {}

  /**
   * Get all locations
   */
  getAll(): ChileLocation[] {
    return [...this.locations];
  }

  /**
   * Search locations by comuna or region
   * @param query Search term
   */
  search(query: string): ChileLocation[] {
    if (!query || query.trim() === '') {
      return this.getAll();
    }
    
    query = query.toLowerCase().trim();
    
    return this.locations.filter(location => 
      location.comuna.toLowerCase().includes(query) || 
      location.region.toLowerCase().includes(query)
    );
  }

  /**
   * Get formatted location string (Comuna, Region)
   * @param location Location object or comuna string
   */
  getFormattedLocation(location: ChileLocation | string): string {
    if (typeof location === 'string') {
      const found = this.locations.find(loc => loc.comuna === location);
      return found ? `${found.comuna}, ${found.region}` : location;
    }
    return `${location.comuna}, ${location.region}`;
  }
}
