import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MotionService {
  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  prefersReducedMotion(): boolean {
    return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }

  runWithViewTransition(update: () => void): void {
    if (this.prefersReducedMotion()) {
      update();
      return;
    }

    const startViewTransition = (
      this.document as Document & {
        startViewTransition?: Document['startViewTransition'];
      }
    ).startViewTransition;

    if (typeof startViewTransition !== 'function') {
      update();
      return;
    }

    startViewTransition.call(this.document, () => {
      update();
    });
  }
}
