import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

/**
 * Reusable logout button component that can be displayed in various styles
 */
@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.scss'
})
export class LogoutButtonComponent {
  private authService = inject(AuthService);
  
  /** Button display style: 'icon' (default) or 'full' */
  @Input() variant: 'icon' | 'full' = 'icon';
  
  /** Custom CSS class to be applied to the button */
  @Input() customClass: string = '';
  
  /** Tooltip text for the button */
  @Input() tooltip: string = 'Cerrar sesión';
  
  /** Whether to show a confirmation dialog before logging out */
  @Input() confirmLogout: boolean = true;
  
  /** Custom confirmation message */
  @Input() confirmMessage: string = '¿Estás seguro que deseas cerrar sesión?';
  
  /** Whether the button is currently loading (during logout process) */
  isLoading = false;
  
  /** Whether the confirmation modal is visible */
  showConfirmDialog = false;

  /**
   * Handle logout action with optional confirmation
   */
  logout(): void {
    if (this.confirmLogout) {
      this.showConfirmDialog = true;
    } else {
      this.performLogout();
    }
  }
  
  /**
   * Cancel logout and close the confirmation dialog
   */
  cancelLogout(): void {
    this.showConfirmDialog = false;
  }
  
  /**
   * Confirm logout and proceed
   */
  confirmLogoutAction(): void {
    this.showConfirmDialog = false;
    this.performLogout();
  }
  
  /**
   * Perform the actual logout operation
   */
  private performLogout(): void {
    this.isLoading = true;
    
    this.authService.signOut()
      .finally(() => {
        this.isLoading = false;
      });
  }
}
