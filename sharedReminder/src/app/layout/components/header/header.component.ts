import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareCodeDialog } from '../../../pages/share-code-dialog/share-code-dialog';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})

export class HeaderComponent {

  constructor(private _dialog: Dialog) { }

  @Output() menuClick = new EventEmitter<void>();

  onMenuClick() {
    this.menuClick.emit();
  }

  onShare() {
    this._dialog.open(ShareCodeDialog, {
      data: {
        url: window.location.href
      },
      backdropClass: 'bg-black/40'
    })
  }
}
