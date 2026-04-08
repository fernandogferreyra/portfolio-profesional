import { Component, computed, inject } from '@angular/core';

import { translations } from '../../i18n/translations';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private readonly languageService = inject(LanguageService);

  readonly currentYear = new Date().getFullYear();
  readonly content = computed(() => translations[this.languageService.language()].footer);
}
