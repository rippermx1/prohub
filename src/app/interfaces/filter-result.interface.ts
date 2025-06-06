export interface FilterResult {
  specialties: string[];
  city: string;
  experience: {
    min: number;
    max?: number;
  } | null;
}