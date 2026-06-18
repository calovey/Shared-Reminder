import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificaitonService } from '../../core/services/notificationService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private notification = inject(NotificaitonService);
  private auth = inject(Auth);

  email = '';
  password = '';
  rememberMe = false;
  loading = false;
  errorMessage = '';

  constructor(private _router: Router) { }

  async login() {
    if (!this.email || !this.password) {
      const message = 'E-posta ve sifre zorunlu.';
      this.errorMessage = message;
      this.notification.showWarning(message, 'Eksik Alan');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.notification.showSuccess('Tekrar hos geldin.', 'Giris Basarili');
      this._router.navigate(['/app']);
    } catch (error: any) {
      let message = 'Giris yapilamadi.';

      if (error.code === 'auth/invalid-credential') {
        message = 'Gecersiz e-posta adresi veya sifre.';
      } else if (error.code === 'auth/user-not-found') {
        message = 'Bu e-posta ile kayitli kullanici bulunamadi.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Sifre hatali.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Gecersiz e-posta adresi.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Cok fazla deneme yapildi. Lutfen biraz sonra tekrar deneyin.';
      }

      this.errorMessage = message;
      this.notification.showError(message, 'Giris Basarisiz');
    } finally {
      this.loading = false;
    }
  }
}
