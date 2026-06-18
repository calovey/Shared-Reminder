import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificaitonService } from '../../../core/services/notificationService';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class ToastComponent {
  protected notificationService = inject(NotificaitonService);

  close() {
    this.notificationService.clear();
  }
}
