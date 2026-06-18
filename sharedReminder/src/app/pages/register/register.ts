import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';

  private auth = inject(Auth);

  constructor(private _router: Router) { }

  async register() {
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Lütfen tüm alanları doldurun.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Şifreler eşleşmiyor.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Şifre en az 6 karakter olmalı.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);

      await updateProfile(userCredential.user, { displayName: this.fullName });
      this._router.navigate(['/app']);

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage = 'Bu e-posta zaten kullanılıyor.';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'Geçersiz e-posta adresi.';
      } else if (error.code === 'auth/weak-password') {
        this.errorMessage = 'Şifre çok zayıf.';
      } else {
        this.errorMessage = 'Kayıt oluşturulamadı.';
      }
    }
    finally {
      this.loading = false;
    }
  }
}
