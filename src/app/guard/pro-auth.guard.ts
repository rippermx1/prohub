import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const proAuthGuard: CanActivateFn = async (route, state) => {
  const sb = inject(SupabaseService);
  const router = inject(Router);
  const {
    data: { session },
  } = await sb.getSession();
  if (!session) {
    router.navigate(['/login']);
    return false;
  }

  const { data: profile, error } = await sb.getProfile(session.user.id);
  if (error) {
    router.navigate(['/login']);
    return false;
  }

  if (!isProfileComplete(profile)) {
    router.navigate(['/onboarding']);
    return false;
  }

  return true;

  // Check role === 'pro' in the public.profiles row
  // const { data } = await sb.checkRole(session.user.id);
  /* ENABLE THIS WHEN PRO PLAN IS READY
  if (data?.plan !== 'pro' && data?.plan !== 'elite') {
    return router.parseUrl('/upgrade');
  } */
};

function isProfileComplete(p: any): boolean {
  return (
    !!p.display_name &&
    !!p.hourly_rate &&
    Array.isArray(p.specialties) &&
    p.specialties.length > 0
  );
}
