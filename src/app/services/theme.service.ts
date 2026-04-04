import { DOCUMENT } from '@angular/common';
import { effect, Inject, Injectable, signal } from '@angular/core';

import { ThemeId } from '../data/portfolio.models';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'portfolio-theme';
  private readonly availableThemes: ThemeId[] = ['themeNeon', 'themeEX', 'themeLight'];

  readonly activeTheme = signal<ThemeId>(this.readStoredTheme());

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    effect(() => {
      const theme = this.activeTheme();
      this.document.documentElement.dataset['theme'] = theme;
      this.saveTheme(theme);
    });
  }

  setTheme(theme: ThemeId): void {
    this.activeTheme.set(theme);
  }

  private readStoredTheme(): ThemeId {
    try {
      const storedTheme = globalThis.localStorage?.getItem(this.storageKey);
      return this.isThemeId(storedTheme) ? storedTheme : 'themeNeon';
    } catch {
      return 'themeNeon';
    }
  }

  private saveTheme(theme: ThemeId): void {
    try {
      globalThis.localStorage?.setItem(this.storageKey, theme);
    } catch {
      // Ignore storage errors and keep the app usable.
    }
  }

  private isThemeId(value: string | null): value is ThemeId {
    return value !== null && this.availableThemes.includes(value as ThemeId);
  }
}
