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
  styleUrl: './tabbar.component.scss',
})
export class TabbarComponent implements OnInit {
  private allNavItems: NavItem[] = [
    { path: '/home', label: 'Inicio', icon: 'home', requiresAuth: false },
    // { path: '/search', label: 'Buscar', icon: 'search', requiresAuth: false },
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: 'chart',
      requiresAuth: true,
    },
    // { path: '/notifications', label: 'Notificaciones', icon: 'notifications', requiresAuth: true, hasNotifications: false },
    { path: '/profile', label: 'Perfil', icon: 'profile', requiresAuth: true },
  ];

  navItems: NavItem[] = [];

  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit(): void {
    // Initialize navigation items immediately
    this.updateNavItems();

    // Subscribe to authentication changes to update items when auth state changes
    this.authService.session$.subscribe(() => {
      this.updateNavItems();
    });
  }
  private updateNavItems(): void {
    console.log(
      'Updating nav items, auth status:',
      this.authService.isAuthenticated()
    );
    const isAuthenticated = this.authService.isAuthenticated();
    this.navItems = this.allNavItems.filter(
      (item) => !item.requiresAuth || (item.requiresAuth && isAuthenticated)
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
    return (
      path !== '' && path !== '/dashboard' && this.router.url.startsWith(path)
    );
  }
  shouldShowTabbar(): boolean {
    // Don't show on landing page
    if (this.router.url === '/landing') {
      console.log('Landing route detected, hiding tabbar');
      return false;
    }

    // Always show on home component (empty path or root path)
    if (this.router.url === '/home' || this.router.url === 'home') {
      return false;
    }

    const session = this.authService.session();

    // If no session, user is not logged in - only show on public routes
    if (!session) {
      return (
        !this.router.url.startsWith('/login') &&
        !this.router.url.startsWith('/register') &&
        !this.router.url.startsWith('/onboarding')
      );
    }

    // Hide on specific routes even when authenticated
    const hiddenRoutes = [
      '/login',
      '/register',
      '/onboarding',
      '/forgot-password',
    ];
    return !hiddenRoutes.some(
      (route) => this.router.url === route || this.router.url.startsWith(route)
    );
  }
}
