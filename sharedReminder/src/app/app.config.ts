import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { ThemeService } from '../theme.service';

export function initTheme(themeService: ThemeService) {
  return () =>
    themeService.setTheme((localStorage.getItem('theme') as 'light' | 'dark') || 'light');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
     {
      provide: APP_INITIALIZER, 
      useFactory: initTheme,     
      deps: [ThemeService],    
      multi: true               
    },
  ],
};
