import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ServicePrice } from '../../services/professionals.service';
import { Professional } from '../../interfaces/professional.interface';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { heroBriefcase, heroGlobeAlt, heroHeart, heroInformationCircle, heroMapPin, heroPhone } from '@ng-icons/heroicons/outline';

interface RatingBar {
  level: string;
  percentage: number;
  count: number;
}

@Component({
  selector: 'app-specialist-detail',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './specialist-detail.component.html',
  styleUrl: './specialist-detail.component.scss',
  providers: [
    provideIcons({
      heroMapPin,
      heroHeart,
      heroInformationCircle,
      heroGlobeAlt,
      heroPhone,
      heroBriefcase
    }),
  ],
})
export class SpecialistDetailComponent implements OnInit {
  @Input() professional!: Professional;
  @Output() close = new EventEmitter<void>();

  // Convert to signals for reactive updates
  services: WritableSignal<ServicePrice[]> = signal([]);
  loading: WritableSignal<boolean> = signal(true);
  noServicesFound: WritableSignal<boolean> = signal(false);

  ratingBars: RatingBar[] = [];

  constructor(private modalService: ModalService) {}

  async ngOnInit() {
    this.loading.set(true);
    this.noServicesFound.set(false);

    try {
      // Check if the professional object has services already
      if (
        this.professional?.services &&
        this.professional.services.length > 0
      ) {
        // Format services from the professional object
        this.formatExistingServices();
      }
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.noServicesFound.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Format services from the professional object into the required format
   */
  private formatExistingServices(): void {
    // Check if services exist and are in array format
    if (
      Array.isArray(this.professional.services) &&
      this.professional.services.length > 0
    ) {
      const formattedServices = this.professional.services.map((service) => ({
        name: service.name,
        price: `$${service.price.toLocaleString('es-CL')}`,
      }));

      this.services.set(formattedServices);
      this.noServicesFound.set(false);
    } else {
      // Fall back to empty state if the services array is invalid
      console.log('Invalid services format');
      this.services.set([]);
      this.noServicesFound.set(true);
    }
  }

  // Format large numbers with K for thousands
  formatLikes(count: number): string {
    if (!count) return '0';
    return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toString();
  }

  closeModal(): void {
    this.modalService.close();
  }

  get ratingStars(): string[] {
    const rating = this.professional.rating || 0;
    if (rating === 0) return [];

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return [
      ...Array(fullStars).fill('star-full'),
      ...(halfStar ? ['star-half'] : []),
      ...Array(emptyStars).fill('star-empty'),
    ];
  }

  contactSpecialist(): void {
    console.log('Contact specialist:', this.professional.display_name);
    if (this.professional.phone) {
      window.open(
        `https://api.whatsapp.com/send?phone=${this.professional.phone}&text=Hola%20${this.professional.display_name},%20me%20gustaría%20contactarte%20para%20consultar%20sobre%20tus%20servicios.`,
        '_blank'
      );
    }
    this.closeModal();
  }
}
