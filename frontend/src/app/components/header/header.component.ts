import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { PORTFOLIO_THEMES } from '../../data/portfolio.data';
import { ThemeId, localizeText } from '../../data/portfolio.models';
import { translations } from '../../i18n/translations';
import { AuthService } from '../../services/auth.service';
import { EditModeService } from '../../services/edit-mode.service';
import { LanguageService } from '../../services/language.service';
import { ProfilePhotoService } from '../../services/profile-photo.service';
import { PublicContentService } from '../../services/public-content.service';
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
  private readonly profilePhotoService = inject(ProfilePhotoService);
  private readonly publicContentService = inject(PublicContentService);

  @Output() readonly privateAccessRequested = new EventEmitter<void>();

  readonly authService = inject(AuthService);
  readonly editModeService = inject(EditModeService);
  readonly currentLanguage = this.languageService.language;
  readonly activeTheme = this.themeService.activeTheme;
  readonly brandAvatarUrl = this.profilePhotoService.profilePhotoUrl;
  readonly failedBrandAvatarUrl = signal<string | null>(null);
  readonly brandAvatarVisible = computed(() => this.failedBrandAvatarUrl() !== this.brandAvatarUrl());
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
  readonly privateAccessLabel = computed(() =>
    this.currentLanguage() === 'es' ? 'Panel de control' : 'Control panel',
  );
  readonly privateAccessAriaLabel = computed(() =>
    this.currentLanguage() === 'es'
      ? 'Abrir panel de control para administrador'
      : 'Open admin control panel',
  );
  readonly controlCenterLabel = computed(() =>
    this.currentLanguage() === 'es' ? 'Panel de control' : 'Control panel',
  );
  readonly editModeLabel = computed(() =>
    this.editModeService.isEnabled() ? 'EditMode Enabled' : 'EditMode Disabled',
  );
  readonly adminStatusLabel = computed(() =>
    this.currentLanguage() === 'es' ? 'Privado activo' : 'Private active',
  );
  readonly logoutLabel = computed(() =>
    this.currentLanguage() === 'es' ? 'Salir' : 'Logout',
  );
  readonly onlineStatusLabel = computed(() =>
    this.authService.isAuthenticated()
      ? this.currentLanguage() === 'es'
        ? 'Online'
        : 'Online'
      : this.currentLanguage() === 'es'
        ? 'Offline'
        : 'Offline',
  );

  constructor() {
    effect(() => {
      const language = this.currentLanguage();
      void this.loadProfilePhoto(language);
    });
  }

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

  openLoginModal(): void {
    this.closeThemeMenu();
    this.privateAccessRequested.emit();
  }

  goToControlCenter(): void {
    if (!this.authService.isAdmin()) {
      this.openLoginModal();
      return;
    }

    void this.router.navigate(['/control-center']);
  }

  logout(): void {
    this.editModeService.disable();
    this.authService.logout();

    if (this.router.url.startsWith('/control-center')) {
      void this.router.navigate(['/'], { fragment: 'home-top' });
    }
  }

  toggleEditMode(): void {
    this.closeThemeMenu();
    this.editModeService.toggle();
  }

  goToHome(event?: Event): void {
    event?.preventDefault();
    void this.router.navigate(['/'], { fragment: 'home-top' }).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  onBrandAvatarError(): void {
    this.failedBrandAvatarUrl.set(this.brandAvatarUrl());
  }

  private async loadProfilePhoto(language: string): Promise<void> {
    try {
      const response = await firstValueFrom(this.publicContentService.listPublicContentBlocks());
      this.profilePhotoService.setFromBlocks(response?.data ?? [], language);
    } catch {
      this.profilePhotoService.setFromBlocks([], language);
    }
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
