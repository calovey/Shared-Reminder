import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { NotificaitonService } from '../../core/services/notificationService';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslocoModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private notification = inject(NotificaitonService);
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private transloco = inject(TranslocoService);

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';

  constructor(private _router: Router) {}

  private t(key: string): string {
    return this.transloco.translate(key);
  }

  async register() {
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      const message = this.t('auth.register.errors.requiredFields');
      this.errorMessage = message;
      this.notification.showWarning(message, this.t('auth.notifications.missingField'));
      return;
    }

    if (this.password !== this.confirmPassword) {
      const message = this.t('auth.register.errors.passwordMismatch');
      this.errorMessage = message;
      this.notification.showWarning(message, this.t('auth.notifications.invalidInput'));
      return;
    }

    if (this.password.length < 6) {
      const message = this.t('auth.register.errors.weakPassword');
      this.errorMessage = message;
      this.notification.showWarning(message, this.t('auth.notifications.weakPassword'));
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);

      await updateProfile(userCredential.user, { displayName: this.fullName });
      await setDoc(
        doc(this.firestore, `users/${userCredential.user.uid}`),
        {
          email: this.email,
          displayName: this.fullName,
          activeWorkspaceCode: null,
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );

      this.notification.showSuccess(this.t('auth.register.success.message'), this.t('auth.register.success.title'));
      this._router.navigate(['/app']);
    } catch (error: any) {
      let message = this.t('auth.register.errors.failed');

      if (error.code === 'auth/email-already-in-use') {
        message = this.t('auth.register.errors.emailInUse');
      } else if (error.code === 'auth/invalid-email') {
        message = this.t('auth.register.errors.invalidEmail');
      } else if (error.code === 'auth/weak-password') {
        message = this.t('auth.register.errors.passwordTooWeak');
      } else if (error.code === 'auth/too-many-requests') {
        message = this.t('auth.common.errors.tooManyRequests');
      }

      this.errorMessage = message;
      this.notification.showError(message, this.t('auth.register.errorTitle'));
    } finally {
      this.loading = false;
    }
  }
}
