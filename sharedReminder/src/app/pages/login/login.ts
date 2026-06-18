import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  loading = false;
  errorMessage = '';

  private auth = inject(Auth);

  constructor(private _router: Router) { }

  async login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'E-posta ve şifre zorunlu';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this._router.navigate(['/app']);
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        this.errorMessage = 'E-posta veya şifre hatalı.';
      } else if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.';
      } else if (error.code === 'auth/wrong-password') {
        this.errorMessage = 'Şifre hatalı.';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'Geçersiz e-posta adresi.';
      } else {
        this.errorMessage = 'Giriş yapılamadı.';
      }
    }
    finally {
      this.loading = false;
    }
  }
}
