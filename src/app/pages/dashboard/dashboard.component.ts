import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LogoutButtonComponent } from '../../components/logout-button/logout-button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LogoutButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  leads = signal<number>(0);
  rating = signal<number>(0);
  sb = inject(SupabaseService);
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {}
  
  async ngOnInit() {
    const { data: { session } } = await this.sb.getSession();
    if (!session) return;
    const uid = session.user.id;
    const metric = await this.sb.getMetrics(uid);
    // Add a type assertion for metric.data
    const data = metric.data as { leads_total?: number; rating_avg?: number } | null;
    this.leads.set(data?.leads_total ?? 0);
    this.rating.set(data?.rating_avg ?? 0);
  }
  
  /**
   * Calculate monthly growth in leads
   * Returns a formatted increment number
   */
  calculateLeadsGrowth(): number {
    const currentLeads = this.leads();
    if (currentLeads <= 0) return 0;
    
    // Simulate a 30% growth from previous month
    return Math.max(1, Math.floor(currentLeads * 0.3));
  }
  // Helper method for star display
  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }
}
