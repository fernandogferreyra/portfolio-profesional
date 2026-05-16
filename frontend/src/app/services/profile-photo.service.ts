import { computed, Injectable, signal } from '@angular/core';

import { PublicContentBlock } from './public-content.service';

@Injectable({
  providedIn: 'root',
})
export class ProfilePhotoService {
  private readonly fallbackUrl = 'images/profile-photo.jpg';
  private readonly documentUrl = signal<string | null>(null);

  readonly profilePhotoUrl = computed(() => this.documentUrl() ?? this.fallbackUrl);

  setFromBlocks(blocks: PublicContentBlock[], language: string): void {
    const languageBlock = blocks.find((block) => block.key === 'site.profile-photo' && block.language === language);
    const fallbackBlock = blocks.find((block) => block.key === 'site.profile-photo' && block.documentUrl);
    this.documentUrl.set(languageBlock?.documentUrl ?? fallbackBlock?.documentUrl ?? null);
  }

  setDocumentUrl(url: string | null): void {
    this.documentUrl.set(url);
  }
}
