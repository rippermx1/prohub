import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserState } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const proAuthGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // First, check if we're authenticated at all
  const isAuthenticated = await firstValueFrom(authService.isAuthenticated$);
  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }
  
  // Then, check user state
  const userState = await firstValueFrom(authService.userState$);
  
  switch (userState) {
    case UserState.SignedIn:
      // User is properly authenticated and has a complete profile
      return true;
      
    case UserState.IncompleteProfile:
    case UserState.NewUser:
      // Redirect to onboarding to complete profile
      router.navigate(['/onboarding']);
      return false;
      
    case UserState.SignedOut:
      // Redirect to login
      router.navigate(['/login']);
      return false;
      
    default:
      // For any other state (including Initializing), redirect to login for safety
      router.navigate(['/login']);
      return false;
  }
};
