import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-share-code-dialog',
  imports: [CommonModule],
  templateUrl: './share-code.html',
  styleUrl: './share-code.scss',
})
export class ShareCodeDialog {

  isLoading = true;
  copied = false;
  workspaceCode = '';

  constructor(
    private dialogRef: DialogRef<ShareCodeDialog>,
    private _cdr: ChangeDetectorRef,
    @Inject(DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.workspaceCode = this.generateWorkspaceCode();
      this.isLoading = false;
      this._cdr.detectChanges();
    }, 1000);
  }

  close() {
    this.dialogRef.close();
  }

  generateWorkspaceCode(length: number = 6): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    // O, 0, I, 1 not exist → for prevent complicate

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }

    return result;
    //this.isLoading = false;
  }

  copyCode() {
    if (this.copied) return; // lock for click
    if (!this.workspaceCode) return;

    // Modern browsers (PWA + iOS)
    navigator.clipboard.writeText(this.workspaceCode).then(() => {
      this.copied = true;
      this._cdr.detectChanges();

      // if small haptic (iOS / Android)
      if (navigator.vibrate) {
        navigator.vibrate(56);
      }

      setTimeout(() => {
        this.copied = false;
        this._cdr.detectChanges();
      }, 2000);
    });
  }
}
