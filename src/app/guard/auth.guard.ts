import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService, UserState } from '../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      
      // If not authenticated, redirect to login
      router.navigate(['/login']);
      return false;
    })
  );
};

export const publicOnlyGuard: CanActivateFn = (route, state) => {
  // Always allow access to public routes, regardless of authentication
  console.log('Public route guard executed, allowing access');
  return true;
};
