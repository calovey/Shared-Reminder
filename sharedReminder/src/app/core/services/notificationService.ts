import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
    visible: boolean;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificaitonService {
    private transloco = inject(TranslocoService);
    private timeoutId: ReturnType<typeof setTimeout> | null = null;

    private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
    toast$ = this.toastSubject.asObservable();

    show(toast: Omit<ToastMessage, 'visible'>) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        const payload: ToastMessage = {
            ...toast,
            visible: true,
            duration: toast.duration ?? 4000
        };

        this.toastSubject.next(payload);

        this.timeoutId = setTimeout(() => {
            this.clear();
        }, payload.duration);
    }

    showError(message: string, title = this.transloco.translate('notifications.titles.error')) {
        this.show({
            type: 'error',
            title,
            message,
            duration: 4000
        });
    }

    showSuccess(message: string, title = this.transloco.translate('notifications.titles.success')) {
        this.show({
            type: 'success',
            title,
            message,
            duration: 3000
        });
    }

    showInfo(message: string, title = this.transloco.translate('notifications.titles.info')) {
        this.show({
            type: 'info',
            title,
            message,
            duration: 3000
        });
    }

    showWarning(message: string, title = this.transloco.translate('notifications.titles.warning')) {
        this.show({
            type: 'warning',
            title,
            message,
            duration: 4000
        });
    }

    clear() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        this.toastSubject.next(null);
    }
}
