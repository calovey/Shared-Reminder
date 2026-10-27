import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NotificationService } from '../../core/services/notificationService';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslocoModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPasswordComponent {
  private notification = inject(NotificationService);
  private auth = inject(Auth);
  private transloco = inject(TranslocoService);

  email = inject(ActivatedRoute).snapshot.queryParamMap.get('email') ?? '';
  loading = false;
  sent = false;
  errorMessage = '';

  private t(key: string, params?: Record<string, string>): string {
    return this.transloco.translate(key, params);
  }

  async sendResetLink() {
    const email = this.email.trim();

    if (!email) {
      const message = this.t('auth.forgotPassword.errors.requiredEmail');
      this.errorMessage = message;
      this.notification.showWarning(message, this.t('auth.notifications.missingField'));
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      // Firebase sends the reset email in this language
      this.auth.languageCode = this.transloco.getActiveLang();
      await sendPasswordResetEmail(this.auth, email);

      // With email enumeration protection Firebase does not reveal whether the account exists,
      // so the success message stays generic either way.
      this.sent = true;
      this.notification.showSuccess(
        this.t('auth.forgotPassword.success.message', { email }),
        this.t('auth.forgotPassword.success.title'),
      );
    } catch (error: any) {
      let message = this.t('auth.forgotPassword.errors.failed');

      if (error.code === 'auth/invalid-email' || error.code === 'auth/missing-email') {
        message = this.t('auth.login.errors.invalidEmail');
      } else if (error.code === 'auth/user-not-found') {
        // Only reachable when enumeration protection is off; keep the response generic.
        this.sent = true;
        return;
      } else if (error.code === 'auth/too-many-requests') {
        message = this.t('auth.common.errors.tooManyRequests');
      }

      this.errorMessage = message;
      this.notification.showError(message, this.t('auth.forgotPassword.errorTitle'));
    } finally {
      this.loading = false;
    }
  }

  tryAgain() {
    this.sent = false;
  }
}
