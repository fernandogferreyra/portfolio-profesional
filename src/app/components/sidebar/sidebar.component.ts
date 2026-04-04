import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { translations } from '../../i18n/translations';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly languageService = inject(LanguageService);

  readonly content = computed(() => translations[this.languageService.language()].header);
}
