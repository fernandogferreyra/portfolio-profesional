import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EditModeService {
  private readonly authService = inject(AuthService);
  private readonly enabledState = signal(false);

  readonly isAvailable = computed(() => this.authService.isAdmin());
  readonly isEnabled = computed(() => this.isAvailable() && this.enabledState());

  constructor() {
    effect(() => {
      if (!this.isAvailable()) {
        this.enabledState.set(false);
      }
    });
  }

  toggle(): void {
    if (!this.isAvailable()) {
      this.enabledState.set(false);
      return;
    }

    this.enabledState.update((enabled) => !enabled);
  }

  disable(): void {
    this.enabledState.set(false);
  }
}
