import { DOCUMENT } from '@angular/common';
import { effect, Inject, Injectable, signal } from '@angular/core';

import { Language } from '../i18n/translations';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly storageKey = 'portfolio-language';

  readonly language = signal<Language>(this.readStoredLanguage());

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    effect(() => {
      const language = this.language();
      this.document.documentElement.lang = language;
      this.saveLanguage(language);
    });
  }

  toggleLanguage(): void {
    this.language.update((currentLanguage) => (currentLanguage === 'es' ? 'en' : 'es'));
  }

  private readStoredLanguage(): Language {
    try {
      const storedLanguage = globalThis.localStorage?.getItem(this.storageKey);
      return storedLanguage === 'en' ? 'en' : 'es';
    } catch {
      return 'es';
    }
  }

  private saveLanguage(language: Language): void {
    try {
      globalThis.localStorage?.setItem(this.storageKey, language);
    } catch {
      // Ignore storage errors and keep the app usable.
    }
  }
}
