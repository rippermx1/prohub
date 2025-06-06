export interface Professional {
  id: string;
  display_name: string;
  city: string | null;
  bio: string | null;
  specialties: string[] | null;
  hourly_rate: number | null;
  avatar_url: string | null;
  verified: boolean;
  rating: number | null;
  experience?: string; // "5 años de experiencia en contabilidad"|
  rut: string | null;          // ← nuevo
  phone: string | null;        // ← nuevo
  website: string | null;      // ← nuevo
  services?: { id: string; name: string; price: number }[]; // ← nuevo
}

export interface ProfessionalFilters {
  city?: string; // “Santiago”
  specialties?: string[]; // [“contabilidad”, “impuestos”]
  minRate?: number; // 20000
  maxRate?: number; // 80000
  search?: string; // texto libre en nombre/bio
  onlyVerified?: boolean; // true → filtro verified = true
}
