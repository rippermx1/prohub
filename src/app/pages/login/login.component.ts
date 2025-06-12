import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  sending = false;
  sent = false;
  error: string | null = null;
  loading = true;

  // Check if already authenticated on component init
  ngOnInit() {
    this.auth.isLoading$.subscribe(loading => {
      this.loading = loading;
      if (!this.loading && this.auth.isAuthenticated()) {
        // If user is authenticated, redirect to dashboard
        this.router.navigate(['/dashboard']);
      }
    });
  }

  loginGoogle() {
    this.sending = true;
    this.auth.googleLogin().finally(() => {
      this.sending = false;
    });
  }

  async sendLink() {
    this.sending = true;
    this.error = null;
    try {
      await this.auth.magicLink(this.email);
      this.sent = true;
    } catch (err: any) {
      this.error = err.message ?? 'Error';
    } finally {
      this.sending = false;
    }
  }

  logout() {
    this.auth.signOut();
  }
}
