import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareCodeDialog } from '../../../pages/share-code-dialog/share-code';
import { ThemeService } from '../../../../theme.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  theme$;

  constructor(
    private _dialog: Dialog,
    private _theme: ThemeService,
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
}
