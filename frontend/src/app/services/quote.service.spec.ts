import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { QuoteRequestPayload } from '../models/quote.models';
import { QuoteService } from './quote.service';

describe('QuoteService', () => {
  let service: QuoteService;
  let httpMock: HttpTestingController;

  const payload: QuoteRequestPayload = {
    projectType: 'SAAS_PLATFORM',
    complexity: 'HIGH',
    modules: ['DISCOVERY', 'AUTHENTICATION', 'CORE_BACKEND'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(QuoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests the technical preview from the backend source of truth', () => {
    let response: unknown;

    service.previewQuote(payload).subscribe((result) => {
      response = result;
    });

    const request = httpMock.expectOne('/api/admin/quotes/preview');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);

    request.flush({
      success: true,
      message: 'Quote preview generated successfully',
      data: {
        projectType: 'SAAS_PLATFORM',
        projectLabel: 'SaaS platform',
        complexity: 'HIGH',
        totalHours: 120,
        totalCost: 4200,
        hourlyRate: 35,
        items: [
          {
            name: 'Discovery and planning',
            hours: 16,
            cost: 560,
          },
        ],
      },
    });

    expect(response).toEqual({
      projectType: 'SAAS_PLATFORM',
      projectLabel: 'SaaS platform',
      complexity: 'HIGH',
      totalHours: 120,
      totalCost: 4200,
      hourlyRate: 35,
      items: [
        {
          name: 'Discovery and planning',
          hours: 16,
          cost: 560,
        },
      ],
    });
  });

  it('saves the estimate through the persisted quote endpoint', () => {
    service.saveQuote(payload).subscribe();

    const request = httpMock.expectOne('/api/quote');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);

    request.flush({
      success: true,
      message: 'Quote generated successfully',
      data: {
        projectType: 'SAAS_PLATFORM',
        projectLabel: 'SaaS platform',
        complexity: 'HIGH',
        totalHours: 120,
        totalCost: 4200,
        hourlyRate: 35,
        items: [],
      },
    });
  });
});
