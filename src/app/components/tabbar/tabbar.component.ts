import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  requiresAuth?: boolean;
  hasNotifications?: boolean;
  notificationCount?: number;
}

@Component({
  selector: 'app-tabbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tabbar.component.html',
  styleUrl: './tabbar.component.scss'
})
export class TabbarComponent implements OnInit {  private allNavItems: NavItem[] = [
    { path: '', label: 'Inicio', icon: 'home', requiresAuth: false },
    // { path: '/search', label: 'Buscar', icon: 'search', requiresAuth: false },
    { path: '/dashboard', label: 'Dashboard', icon: 'chart', requiresAuth: true },
    // { path: '/notifications', label: 'Notificaciones', icon: 'notifications', requiresAuth: true, hasNotifications: false },
    { path: '/profile', label: 'Perfil', icon: 'profile', requiresAuth: true }
  ];
  
  navItems: NavItem[] = [];
  
  constructor(private router: Router, private authService: AuthService) {}
  
  ngOnInit(): void {
    // Filter navigation items based on authentication status
    this.updateNavItems();
    
    // Subscribe to authentication changes
    this.authService.isAuthenticated$.subscribe(() => {
      this.updateNavItems();
    });
  }
  
  private updateNavItems(): void {
    const isAuthenticated = this.authService.isAuthenticated();
    this.navItems = this.allNavItems.filter(item => 
      !item.requiresAuth || (item.requiresAuth && isAuthenticated)
    );
  }
  
  navigate(path: string): void {
    if (this.router.url !== path) {
      this.router.navigateByUrl(path);
    }
  }

  isActive(path: string): boolean {
    if (path === '/dashboard' && this.router.url === '/dashboard') {
      return true;
    }
    if (path === '' && (this.router.url === '/' || this.router.url === '')) {
      return true;
    }
    return path !== '' && path !== '/dashboard' && this.router.url.startsWith(path);
  }
  
  shouldShowTabbar(): boolean {
    const session = this.authService.session();
    
    // If no session, user is not logged in - only show on public routes
    if (!session) {
      return !this.router.url.startsWith('/login') && 
             !this.router.url.startsWith('/register') && 
             !this.router.url.startsWith('/onboarding');
    }
    
    // Hide on specific routes even when authenticated
    const hiddenRoutes = ['/login', '/register', '/onboarding', '/forgot-password'];
    return !hiddenRoutes.some(route => 
      this.router.url === route || 
      this.router.url.startsWith(route)
    );
  }
}
