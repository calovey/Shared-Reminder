import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NotificaitonService } from '../../../core/services/notificationService';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, AsyncPipe, TranslocoModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class ToastComponent {
  protected notificationService = inject(NotificaitonService);
    private transloco = inject(TranslocoService);
  

  close() {
    this.notificationService.clear();
  }
}
