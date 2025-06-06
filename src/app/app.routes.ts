import { Routes } from '@angular/router';
import { proAuthGuard } from './guard/pro-auth.guard';
import { publicOnlyGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    pathMatch: 'full',
    canActivate: [publicOnlyGuard]
  },
  {
    path: 'buscar',
    loadComponent: () => 
      import('./pages/search/search.component').then((m) => m.SearchComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [proAuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [proAuthGuard]
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding-wizard/onboarding-wizard.component').then((m) => m.OnboardingWizardComponent),
    canActivate: [proAuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => 
      import('./pages/login/login.component').then((m) => m.LoginComponent)
  }
];
