import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { ThemeService } from '../theme.service';
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';

const availableLangs = ['en', 'tr', 'es', 'de'];
type AppLang = 'en' | 'tr' | 'es' | 'de';


export function initTheme(themeService: ThemeService) {
  return () =>
    themeService.setTheme((localStorage.getItem('theme') as 'light' | 'dark') || 'light');
}

export function initLanguage(translocoService: TranslocoService) {
  return () => {
    const savedLang = localStorage.getItem('lang') as AppLang | null;
    const lang = savedLang && availableLangs.includes(savedLang) ? savedLang : 'en';

    translocoService.setActiveLang(lang);
    localStorage.setItem('lang', lang);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
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
    {
      provide: APP_INITIALIZER,
      useFactory: initLanguage,
      deps: [TranslocoService],
      multi: true
    },
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs,
        defaultLang: 'en',
        fallbackLang: 'tr',
        failedRetries: 0,
        missingHandler: {
          useFallbackTranslation: true,
          allowEmpty: true,
          logMissingKey: !isDevMode(),
        },
        reRenderOnLangChange: true, prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader
    }),
  ],
};
