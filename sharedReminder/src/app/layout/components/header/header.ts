import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../theme.service';
import { ShareCodeDialog } from '../../../pages/share-code-dialog/share-code';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, LanguageSwitcherComponent],
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
      await this._router.navigate(['/login']);
      await signOut(this.auth);
    } catch (error) {
      console.error('Cikis yapilirken hata olustu:', error);
    }
  }
}
