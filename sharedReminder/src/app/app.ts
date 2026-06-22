import { ApplicationRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, first } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './layout/components/toast/toast';
import { NotificaitonService } from './core/services/notificationService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly appRef = inject(ApplicationRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly swUpdate = inject(SwUpdate);
  private readonly notification = inject(NotificaitonService);

  constructor() {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.versionUpdates
      .pipe(
        filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.notification.showInfo('Yeni surum bulundu. Uygulama yenileniyor...', 'Guncelleme');
        void this.activateUpdate();
      });

    this.appRef.isStable
      .pipe(
        first((isStable) => isStable),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        void this.swUpdate.checkForUpdate();
      });
  }

  private async activateUpdate() {
    await this.swUpdate.activateUpdate();
    window.location.reload();
  }
}
