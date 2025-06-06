import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-tabbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tabbar.component.html',
  styleUrl: './tabbar.component.scss'
})
export class TabbarComponent {
  navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/profile', label: 'Perfil', icon: 'user' }
  ];
  
  constructor(private router: Router, private authService: AuthService) {}
  
  navigate(path: string): void {
    if (this.router.url !== path) {
      this.router.navigateByUrl(path);
    }
  }

  isActive(path: string): boolean {
    if (path === '/dashboard' && this.router.url === '/dashboard') {
      return true;
    }
    return path !== '/dashboard' && this.router.url.startsWith(path);
  }
  
  shouldShowTabbar(): boolean {
    const session = this.authService.session();
    
    // If no session, user is not logged in
    if (!session) {
      return false;
    }
    
    // Explicitly mark home page as public and never show tabbar there
    if (this.router.url === '/' || this.router.url === '') {
      return false;
    }
    
    // Hide on other public routes
    const publicRoutes = ['/login', '/register', '/onboarding', '/forgot-password'];
    return !publicRoutes.some(route => 
      this.router.url === route || 
      this.router.url.startsWith(route)
    );
  }
}
