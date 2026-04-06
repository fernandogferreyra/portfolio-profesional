import { Injectable } from '@angular/core';

import type { Language } from '../i18n/translations';

export interface ContactMessagePayload {
  to: string;
  name: string;
  email: string;
  context: string;
  subject: string;
  message: string;
  language: Language;
  source: string;
  submittedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  async submitMessage(payload: ContactMessagePayload): Promise<void> {
    await new Promise<void>((resolve) => {
      globalThis.setTimeout(() => resolve(), 850);
    });

    // Prepared for a future API integration without changing the form contract.
    console.info('[contact-service] Pending backend integration.', payload);
  }
}
