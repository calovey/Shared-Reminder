import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

type LanguageOption = {
  code: string;
  label: string;
  shortLabel: string;
  icon: string;
};

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcherComponent {
  private translocoService = inject(TranslocoService);

  @Input() compact = false;
  @Input() align: 'left' | 'right' = 'left';

  currentLang = this.translocoService.getActiveLang();
  isOpen = false;
  readonly languages: LanguageOption[] = [
    { code: 'tr', label: 'Turkce', shortLabel: 'TR', icon: 'assets/language/tr-flag.svg' },
    { code: 'en', label: 'English', shortLabel: 'EN', icon: 'assets/language/uk-flag.svg' },
    { code: 'es', label: 'Espanol', shortLabel: 'ES', icon: 'assets/language/es-flag.svg' },
    { code: 'de', label: 'Deutsch', shortLabel: 'DE', icon: 'assets/language/de-flag.svg' },
  ];

  get selectedLanguage(): LanguageOption {
    return this.languages.find((language) => language.code === this.currentLang) ?? this.languages[0];
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  changeLang(lang: string): void {
    this.translocoService.setActiveLang(lang);
    localStorage.setItem('lang', lang);
    this.currentLang = lang;
    this.isOpen = false;
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.isOpen = false;
  }

  onContainerClick(event: Event): void {
    event.stopPropagation();
  }
}
