import { DOCUMENT } from '@angular/common';
import { effect, inject, Inject, Injectable, signal } from '@angular/core';

import { ThemeId } from '../data/portfolio.models';
import { MotionService } from './motion.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly motionService = inject(MotionService);
  private readonly storageKey = 'portfolio-theme';
  private readonly availableThemes: ThemeId[] = ['themeNeon', 'themeEX', 'themeLight'];

  readonly activeTheme = signal<ThemeId>(this.readStoredTheme());

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.document.documentElement.dataset['theme'] = this.activeTheme();

    effect(() => {
      const theme = this.activeTheme();
      this.document.documentElement.dataset['theme'] = theme;
      this.saveTheme(theme);
    });
  }

  setTheme(theme: ThemeId): void {
    if (theme === this.activeTheme()) {
      return;
    }

    this.motionService.runWithViewTransition(() => {
      this.activeTheme.set(theme);
    });
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
