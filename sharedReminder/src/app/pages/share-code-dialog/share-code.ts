import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from '../../core/services/workspaceService';

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
    private _workspaceService: WorkspaceService,
    @Inject(DIALOG_DATA) public data: any
  ) { }

  async ngOnInit() {
    this.isLoading = true;

    // min 300-500ms spinner
    setTimeout(async () => {
      try {
        this.workspaceCode = await this._workspaceService.getOrCreateWorkspace();
        this.isLoading = false;
        this._cdr.detectChanges();
      } catch (err) {
        console.error(err);
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    }, 400);
  }

  close() {
    this.dialogRef.close();
  }

  async copyCode() {
    if (this.copied) return;
    if (!this.workspaceCode) return;

    await navigator.clipboard.writeText(this.workspaceCode);

    this.copied = true;
    this._cdr.detectChanges();

    if (navigator.vibrate) navigator.vibrate(56);

    setTimeout(() => {
      this.copied = false;
      this._cdr.detectChanges();
    }, 2000);
  }
}
