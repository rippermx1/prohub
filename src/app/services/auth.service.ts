import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  sb = inject(SupabaseService);
  router = inject(Router);
  
  // Use a reactive signal for the session state
  session = signal<any>(null);
  // Add a loading state to track authentication status
  isLoading = signal<boolean>(true);
  // Add a user signal to easily access the current user
  currentUser = signal<any>(null);

  constructor() {
    // Initialize session from stored value
    this.initSession();

    // Listen for auth changes
    this.sb.supabase.auth.onAuthStateChange((event, session) => {
      this.handleAuthChange(event, session);
    });
  }

  private async initSession() {
    try {
      const { data } = await this.sb.supabase.auth.getSession();
      this.session.set(data.session);
      this.currentUser.set(data.session?.user || null);
    } catch (error) {
      console.error('Error initializing session:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async handleAuthChange(event: string, session: any) {
    this.session.set(session);
    this.currentUser.set(session?.user || null);
    
    // Only handle specific auth events to prevent excessive firing
    if ((event === 'SIGNED_IN') && session?.user?.id) {
      // Skip redirection logic if we're on the home page
      if (this.router.url === '/') {
        return;
      }
      
      try {
        const { data, error } = await this.sb.checkUserExists(session.user.id);
        
        if (error) {
          console.error('Error checking user profile:', error);
          if (this.router.url !== '/onboarding') {
            this.router.navigate(['/onboarding']);
          }
          return;
        }
        
        if (data) {
          // User exists and has a profile, check if profile is complete
          const isComplete = this.isProfileComplete(data);
          if (isComplete) {
            // Profile is complete, go to dashboard if not already there
            if (this.router.url !== '/dashboard') {
              this.router.navigate(['/dashboard']);
            }
          } else {
            // Profile exists but is incomplete, go to onboarding if not already there
            if (this.router.url !== '/onboarding') {
              this.router.navigate(['/onboarding']);
            }
          }
        } else {
          // New user, go to onboarding if not already there
          if (this.router.url !== '/onboarding') {
            this.router.navigate(['/onboarding']);
          }
        }
      } catch (error) {
        console.error('Error during auth redirect:', error);
        if (this.router.url !== '/onboarding') {
          this.router.navigate(['/onboarding']);
        }
      }
    } else if (event === 'SIGNED_OUT') {
      // Navigate to login when signed out, but only if not already on login or home page
      if (this.router.url !== '/login' && this.router.url !== '/') {
        this.router.navigate(['/login']);
      }
    }
  }

  // Helper to check if a profile is complete
  private isProfileComplete(profile: any): boolean {
    return !!(
      profile.display_name && 
      profile.specialties && 
      Array.isArray(profile.specialties) && 
      profile.specialties.length > 0
    );
  }

  googleLogin() {
    return this.sb.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`, // Change to root, we'll handle redirection in the auth state change
      },
    });
  }

  async magicLink(email: string) {
    const { error } = await this.sb.supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  }

  async signOut() {
    try {
      const { error } = await this.sb.supabase.auth.signOut();
      if (error) throw error;
      // Clear local state
      this.session.set(null);
      this.currentUser.set(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
  
  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.session();
  }
}
