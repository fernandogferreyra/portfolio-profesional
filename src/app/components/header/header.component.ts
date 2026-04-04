import { Component, computed, inject } from '@angular/core';

import { PORTFOLIO_THEMES } from '../../data/portfolio.data';
import { ThemeId, localizeText } from '../../data/portfolio.models';
import { translations } from '../../i18n/translations';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly languageService = inject(LanguageService);
  private readonly themeService = inject(ThemeService);

  readonly currentLanguage = this.languageService.language;
  readonly activeTheme = this.themeService.activeTheme;
  readonly content = computed(() => translations[this.currentLanguage()].header);
  readonly themes = computed(() =>
    PORTFOLIO_THEMES.map((theme) => ({
      id: theme.id,
      shortLabel: theme.shortLabel,
      label: localizeText(theme.label, this.currentLanguage()),
    })),
  );
  readonly themeSwitcherLabel = computed(() =>
    this.currentLanguage() === 'es' ? 'Cambiar theme visual' : 'Change visual theme',
  );

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  setTheme(themeId: ThemeId): void {
    this.themeService.setTheme(themeId);
  }
}
