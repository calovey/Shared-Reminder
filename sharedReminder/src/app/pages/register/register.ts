import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { NotificaitonService } from '../../core/services/notificationService';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private notification = inject(NotificaitonService);
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';

  constructor(private _router: Router) { }

  async register() {
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      const message = 'Lutfen tum alanlari doldurun.';
      this.errorMessage = message;
      this.notification.showWarning(message, 'Eksik Alan');
      return;
    }

    if (this.password !== this.confirmPassword) {
      const message = 'Sifreler eslesmiyor.';
      this.errorMessage = message;
      this.notification.showWarning(message, 'Hatali Giris');
      return;
    }

    if (this.password.length < 6) {
      const message = 'Sifre en az 6 karakter olmali.';
      this.errorMessage = message;
      this.notification.showWarning(message, 'Zayif Sifre');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);

      await updateProfile(userCredential.user, { displayName: this.fullName });
      await setDoc(doc(this.firestore, `users/${userCredential.user.uid}`), {
        email: this.email,
        displayName: this.fullName,
        activeWorkspaceCode: null,
        createdAt: serverTimestamp()
      }, { merge: true });

      this.notification.showSuccess('Hesabiniz olusturuldu.', 'Kayit Basarili');
      this._router.navigate(['/app']);
    } catch (error: any) {
      let message = 'Kayit olusturulamadi.';

      if (error.code === 'auth/email-already-in-use') {
        message = 'Bu e-posta zaten kullaniliyor.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Gecersiz e-posta adresi.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Sifre cok zayif.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Cok fazla deneme yapildi. Lutfen biraz sonra tekrar deneyin.';
      }

      this.errorMessage = message;
      this.notification.showError(message, 'Kayit Basarisiz');
    } finally {
      this.loading = false;
    }
  }
}
