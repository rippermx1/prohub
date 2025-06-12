import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, distinctUntilChanged, map } from 'rxjs';

export enum UserState {
  Initializing = 'initializing',
  SignedOut = 'signed-out',
  SignedIn = 'signed-in',
  NewUser = 'new-user',
  IncompleteProfile = 'incomplete-profile'
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  sb = inject(SupabaseService);
  router = inject(Router);
  
  // Observable streams for authentication state
  private sessionSubject = new BehaviorSubject<any>(null);
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private currentUserSubject = new BehaviorSubject<any>(null);
  private userStateSubject = new BehaviorSubject<UserState>(UserState.Initializing);
  
  // Public observables
  readonly session$ = this.sessionSubject.asObservable();
  readonly isLoading$ = this.loadingSubject.asObservable();
  readonly currentUser$ = this.currentUserSubject.asObservable();
  readonly userState$ = this.userStateSubject.asObservable();
  
  // Derived observables
  readonly isAuthenticated$ = this.session$.pipe(
    map(session => !!session),
    distinctUntilChanged()
  );
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
      this.sessionSubject.next(data.session);
      this.currentUserSubject.next(data.session?.user || null);
      
      if (data.session) {
        this.checkUserProfile(data.session.user.id);
      } else {
        this.userStateSubject.next(UserState.SignedOut);
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      this.userStateSubject.next(UserState.SignedOut);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  private async checkUserProfile(userId: string): Promise<void> {
    try {
      const { data, error } = await this.sb.checkUserExists(userId);
      
      if (error) {
        console.error('Error checking user profile:', error);
        this.userStateSubject.next(UserState.IncompleteProfile);
        return;
      }
      
      if (data) {
        // User exists and has a profile, check if profile is complete
        const isComplete = this.isProfileComplete(data);
        if (isComplete) {
          this.userStateSubject.next(UserState.SignedIn);
        } else {
          this.userStateSubject.next(UserState.IncompleteProfile);
        }
      } else {
        // New user
        this.userStateSubject.next(UserState.NewUser);
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
      this.userStateSubject.next(UserState.IncompleteProfile);
    }
  }
  private async handleAuthChange(event: string, session: any) {
    // Update session and user subjects
    this.sessionSubject.next(session);
    this.currentUserSubject.next(session?.user || null);
    
    // Handle auth events
    if (event === 'SIGNED_IN' && session?.user?.id) {
      await this.checkUserProfile(session.user.id);
      this.handleRedirectBasedOnState();
    } else if (event === 'SIGNED_OUT') {
      this.userStateSubject.next(UserState.SignedOut);
      this.handleSignOutRedirect();
    }
  }

  private handleRedirectBasedOnState() {
    // Get current state
    const currentState = this.userStateSubject.getValue();
    const currentUrl = this.router.url;
    
    // Skip redirection if we're on the home page
    if (currentUrl === '/') {
      return;
    }
    
    switch (currentState) {
      case UserState.NewUser:
      case UserState.IncompleteProfile:
        // Redirect to onboarding if not already there
        if (currentUrl !== '/onboarding') {
          this.router.navigate(['/onboarding']);
        }
        break;
      case UserState.SignedIn:
        // Redirect to dashboard if not already there
        if (currentUrl !== '/dashboard' && 
            currentUrl !== '/profile' && 
            !currentUrl.startsWith('/search')) {
          this.router.navigate(['/dashboard']);
        }
        break;
    }
  }
  
  private handleSignOutRedirect() {
    // Navigate to login when signed out, but only if not already on login or home page
    if (this.router.url !== '/login' && this.router.url !== '/') {
      this.router.navigate(['/login']);
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
        redirectTo: `${window.location.origin}`,
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
      this.sessionSubject.next(null);
      this.currentUserSubject.next(null);
      this.userStateSubject.next(UserState.SignedOut);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
  
  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.sessionSubject.getValue();
  }
  
  // Helper method to get current session - for backward compatibility
  session(): any {
    return this.sessionSubject.getValue();
  }
}
