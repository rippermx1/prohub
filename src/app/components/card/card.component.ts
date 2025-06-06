import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { SpecialistDetailComponent } from '../specialist-detail/specialist-detail.component';
import { Professional } from '../../interfaces/professional.interface';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnInit {
  @Input() professional!: Professional;
  
  // Optional configuration props
  @Input() showWebsite = true;
  
  // For compatibility or mock data
  private likes?: number;
  
  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    // Generate random likes for display if needed
    this.likes = Math.floor(5 + Math.random() * 95);
  }

  viewDetails(): void {
    // Create detail view object from professional data
    const professionalDetail = {
      id: this.professional.id,
      display_name: this.professional.display_name,
      avatar_url: this.professional.avatar_url || '',
      city: this.professional.city,
      specialties: this.professional.specialties || [],
      verified: this.professional.verified || false,
      rating: this.professional.rating || 0,
      hourly_rate: this.professional.hourly_rate,
      price: this.professional.hourly_rate ? 
        `$${this.professional.hourly_rate.toLocaleString()}/hr` : 
        'No disponible',
      bio: this.professional.bio,
      website: this.professional.website,
      phone: this.professional.phone,
      rut: this.professional.rut,      
      services: this.professional.services,
    };
    
    this.modalService.open(SpecialistDetailComponent, { professional: professionalDetail });
  }
  
  /**
   * Open the professional's website in a new tab
   */
  openWebsite(event: Event): void {
    event.stopPropagation(); // Prevent card click from triggering
    if (this.professional.website) {
      window.open(this.professional.website, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Format large numbers with K for thousands
   */
  formatLikes(count: number): string {
    return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toString();
  }
  
  /**
   * Format website URL for display in a user-friendly way
   */
  getWebsiteDisplay(url: string): string {
    if (!url) return '';
    
    try {
      // Parse the URL to get its components
      const urlObj = new URL(url);
      
      // Get domain without www
      let domain = urlObj.hostname.replace(/^www\./, '');
      
      // Make it more visually appealing by showing just domain and TLD
      return domain;
    } catch (e) {
      // If URL parsing fails, show a fallback
      return 'Sitio web';
    }
  }
}
