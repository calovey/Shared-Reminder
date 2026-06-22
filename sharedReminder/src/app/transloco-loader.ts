import { inject, Injectable } from "@angular/core";
import { Translation, TranslocoLoader } from "@jsverse/transloco";
import { HttpClient } from "@angular/common/http";
import { catchError, forkJoin, map, of } from "rxjs";

const fallbackLangOrder = ['tr', 'en', 'es', 'de'];

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    private http = inject(HttpClient);

    getTranslation(lang: string) {
        const langsToTry = [
            ...fallbackLangOrder.filter((fallbackLang) => fallbackLang !== lang),
            lang,
        ];

        return forkJoin(
            langsToTry.map((langToLoad) =>
                this.http.get<Translation>(`/i18n/${langToLoad}.json`).pipe(
                    catchError(() => of({})),
                ),
            ),
        ).pipe(
            map((translations) =>
                translations.reduce<Translation>(
                    (merged, translation) => ({ ...merged, ...translation }),
                    {},
                ),
            ),
        );
    }
}
