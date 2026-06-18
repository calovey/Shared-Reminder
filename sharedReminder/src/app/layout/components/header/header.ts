import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareCodeDialog } from '../../../pages/share-code-dialog/share-code';
import { ThemeService } from '../../../../theme.service';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  theme$;

  private auth = inject(Auth);

  constructor(
    private _dialog: Dialog,
    private _theme: ThemeService,
    private _router: Router
  ) {
    this.theme$ = this._theme.theme$;
  }

  @Output() menuClick = new EventEmitter<void>();

  toggleTheme() {
    this._theme.toggleTheme();
  }

  onMenuClick() {
    this.menuClick.emit();
  }

  onShare() {
    this._dialog.open(ShareCodeDialog, {
      data: {
        url: window.location.href,
      },
      backdropClass: 'bg-black/40',
    });
  }

  async onLogout() {
    try {
      await signOut(this.auth);
      this._router.navigate(['/login']);
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  }
}
