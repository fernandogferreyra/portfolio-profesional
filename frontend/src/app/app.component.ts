import { Component, inject, signal } from '@angular/core';

import { SiteActivityService } from './services/site-activity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly siteActivityService = inject(SiteActivityService);

  title = 'portfolio-ferchuz';
  readonly loginModalOpen = signal(false);

  openLoginModal(): void {
    this.loginModalOpen.set(true);
  }

  closeLoginModal(): void {
    this.loginModalOpen.set(false);
  }

  onAuthenticated(): void {
    this.closeLoginModal();
  }
}
