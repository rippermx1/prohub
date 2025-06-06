import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Check if user is logged in
  if (authService.isAuthenticated()) {
    return true;
  }
  
  // If not authenticated, redirect to login
  router.navigate(['/login']);
  return false;
};

export const publicOnlyGuard: CanActivateFn = (route, state) => {
  return true;
};
