import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NotificaitonService } from '../../core/services/notificationService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslocoModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private notification = inject(NotificaitonService);
  private auth = inject(Auth);
  private transloco = inject(TranslocoService);

  email = '';
  password = '';
  rememberMe = false;
  loading = false;
  errorMessage = '';

  constructor(private _router: Router) {}

  private t(key: string): string {
    return this.transloco.translate(key);
  }

  async login() {
    if (!this.email || !this.password) {
      const message = this.t('auth.login.errors.requiredFields');
      this.errorMessage = message;
      this.notification.showWarning(message, this.t('auth.notifications.missingField'));
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.notification.showSuccess(this.t('auth.login.success.message'), this.t('auth.login.success.title'));
      this._router.navigate(['/app']);
    } catch (error: any) {
      let message = this.t('auth.login.errors.failed');

      if (error.code === 'auth/invalid-credential') {
        message = this.t('auth.login.errors.invalidCredential');
      } else if (error.code === 'auth/user-not-found') {
        message = this.t('auth.login.errors.userNotFound');
      } else if (error.code === 'auth/wrong-password') {
        message = this.t('auth.login.errors.wrongPassword');
      } else if (error.code === 'auth/invalid-email') {
        message = this.t('auth.login.errors.invalidEmail');
      } else if (error.code === 'auth/too-many-requests') {
        message = this.t('auth.common.errors.tooManyRequests');
      }

      this.errorMessage = message;
      this.notification.showError(message, this.t('auth.login.errorTitle'));
    } finally {
      this.loading = false;
    }
  }
}
