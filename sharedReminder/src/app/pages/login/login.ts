import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {

  email = '';
  password = '';
  rememberMe = false;
  loading = false;
  errorMessage = '';

  constructor(private _router: Router) { }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'E-posta ve şifre zorunlu';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // For now fake login
    setTimeout(() => {
      this.loading = false;
      this._router.navigate(['/app']);
    }, 1000);
  }
}