import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { PORTFOLIO_THEMES } from '../../data/portfolio.data';
import { ThemeId, localizeText } from '../../data/portfolio.models';
import { translations } from '../../i18n/translations';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly languageService = inject(LanguageService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);

  readonly currentLanguage = this.languageService.language;
  readonly activeTheme = this.themeService.activeTheme;
  readonly brandAvatarUrl = 'images/profile-photo.jpg';
  readonly brandAvatarVisible = signal(true);
  readonly themeMenuOpen = signal(false);
  readonly content = computed(() => translations[this.currentLanguage()].header);
  readonly themes = computed(() =>
    PORTFOLIO_THEMES.map((theme) => ({
      id: theme.id,
      shortLabel: theme.shortLabel,
      label: theme.shortLabel,
      description: localizeText(theme.description, this.currentLanguage()),
      preview: theme.preview,
    })),
  );
  readonly activeThemeOption = computed(
    () => this.themes().find((theme) => theme.id === this.activeTheme()) ?? this.themes()[0],
  );
  readonly themeSwitcherLabel = computed(() =>
    this.currentLanguage() === 'es' ? 'Seleccionar theme visual' : 'Select visual theme',
  );
  readonly themeMenuOptionsLabel = computed(() =>
    this.currentLanguage() === 'es' ? 'Opciones de theme visual' : 'Visual theme options',
  );
  readonly homeShortcutLabel = computed(() =>
    this.currentLanguage() === 'es' ? 'Ir al inicio' : 'Go home',
  );

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  setTheme(themeId: ThemeId): void {
    this.themeService.setTheme(themeId);
  }

  toggleThemeMenu(): void {
    this.themeMenuOpen.update((isOpen) => !isOpen);
  }

  closeThemeMenu(): void {
    this.themeMenuOpen.set(false);
  }

  selectTheme(themeId: ThemeId): void {
    this.setTheme(themeId);
    this.closeThemeMenu();
  }

  goToHome(event?: Event): void {
    event?.preventDefault();
    void this.router.navigate(['/'], { fragment: 'home-top' }).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  onBrandAvatarError(): void {
    this.brandAvatarVisible.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;

    if (target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.closeThemeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeThemeMenu();
  }
}
