import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BudgetBuilderUiFacade } from './budget-builder-ui.facade';

describe('BudgetBuilderUiFacade', () => {
  let facade: BudgetBuilderUiFacade;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    facade = TestBed.inject(BudgetBuilderUiFacade);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sends the backend preview payload unchanged', () => {
    let response: unknown;

    facade
      .previewBudget({
        budgetName: 'Commerce MVP',
        projectType: 'standard_project',
        pricingMode: 'PROJECT',
        desiredStackId: 'default_web_stack',
        complexity: 'MEDIUM',
        urgency: 'STANDARD',
        selectedModuleIds: ['DISCOVERY', 'FRONTEND_APP', 'CORE_BACKEND', 'DATABASE_LAYER'],
        moduleSelectionMode: 'EXPLICIT',
        selectedSurchargeRuleIds: ['management-contingency-fixed'],
        supportEnabled: true,
        supportPlanId: 'support-basic',
        maintenancePlanId: null,
        hourlyRateOverride: 20,
        manualDiscount: {
          label: 'Manual discount',
          reason: 'UI negotiation adjustment',
          mode: 'FIXED',
          value: 50,
          cadence: 'ONE_TIME',
        },
        activeClients: null,
        userScaleTierId: null,
        extraMonthlyHours: null,
        notes: [],
      })
      .subscribe((result) => {
        response = result;
      });

    const request = httpMock.expectOne('/api/admin/budget-builder/preview');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      budgetName: 'Commerce MVP',
      projectType: 'standard_project',
      pricingMode: 'PROJECT',
      desiredStackId: 'default_web_stack',
      complexity: 'MEDIUM',
      urgency: 'STANDARD',
      selectedModuleIds: ['DISCOVERY', 'FRONTEND_APP', 'CORE_BACKEND', 'DATABASE_LAYER'],
      moduleSelectionMode: 'EXPLICIT',
      selectedSurchargeRuleIds: ['management-contingency-fixed'],
      supportEnabled: true,
        supportPlanId: 'support-basic',
        maintenancePlanId: null,
        hourlyRateOverride: 20,
      manualDiscount: {
        label: 'Manual discount',
        reason: 'UI negotiation adjustment',
        mode: 'FIXED',
        value: 50,
        cadence: 'ONE_TIME',
        },
        activeClients: null,
        userScaleTierId: null,
        extraMonthlyHours: null,
        notes: [],
      });

    request.flush({
      success: true,
      message: 'Budget preview generated successfully',
      data: {
        configurationSnapshotId: 'budget-builder-seed-v1',
        previewHash: 'preview-hash',
        currency: 'ARS',
        totalHours: 48,
        totalWeeks: 1.5,
        baseAmount: 960,
        oneTimeSubtotal: 1260,
        monthlySubtotal: 24,
        finalOneTimeTotal: 1210,
        finalMonthlyTotal: 24,
        modules: [],
        surcharges: [],
        discounts: [],
        explanation: [],
      },
    });

    expect(response).toEqual({
      configurationSnapshotId: 'budget-builder-seed-v1',
      previewHash: 'preview-hash',
      modules: [],
      technicalEstimate: {
        totalHours: 48,
        totalWeeks: 1.5,
      },
      commercialBudget: {
        currency: 'ARS',
        baseAmount: 960,
        oneTimeSubtotal: 1260,
        monthlySubtotal: 24,
        surchargeItems: [],
        discountItems: [],
        finalOneTimeTotal: 1210,
        finalMonthlyTotal: 24,
        pricingExplanation: [],
      },
    });
  });

  it('maps the backend preview response to the UI result contract', () => {
    let response: ReturnType<typeof jasmine.createSpy> | unknown;

    facade
      .previewBudget({
        budgetName: 'External stack quote',
        projectType: 'standard_project',
        pricingMode: 'PROJECT',
        desiredStackId: 'outside_primary_stack',
        complexity: 'MEDIUM',
        urgency: 'STANDARD',
        selectedModuleIds: ['DISCOVERY', 'CORE_BACKEND'],
        moduleSelectionMode: 'EXPLICIT',
        selectedSurchargeRuleIds: ['management-contingency-fixed'],
        supportEnabled: false,
        supportPlanId: null,
        maintenancePlanId: null,
        hourlyRateOverride: 18,
        manualDiscount: null,
        activeClients: null,
        userScaleTierId: null,
        extraMonthlyHours: null,
        notes: [],
      })
      .subscribe((result) => {
        response = result;
      });

    const request = httpMock.expectOne('/api/admin/budget-builder/preview');
    expect(request.request.body.selectedModuleIds).toEqual(['DISCOVERY', 'CORE_BACKEND']);
    expect(request.request.body.supportEnabled).toBeFalse();
    expect(request.request.body.supportPlanId).toBeNull();
    expect(request.request.body.manualDiscount).toBeNull();

    request.flush({
      success: true,
      message: 'Budget preview generated successfully',
      data: {
        configurationSnapshotId: 'budget-builder-seed-v1',
        previewHash: 'outside-stack-preview',
        currency: 'ARS',
        totalHours: 20,
        totalWeeks: 0.6,
        baseAmount: 360,
        oneTimeSubtotal: 696,
        monthlySubtotal: 0,
        finalOneTimeTotal: 696,
        finalMonthlyTotal: 0,
        modules: [
          {
            id: 'DISCOVERY',
            category: 'analysis_design',
            name: 'Discovery',
            description: 'Initial scoping and solution framing.',
            dependencyIds: [],
            blockingNote: null,
            estimatedHours: 8,
          },
          {
            id: 'CORE_BACKEND',
            category: 'backend',
            name: 'Core backend',
            description: 'Core APIs and business rules.',
            dependencyIds: [],
            blockingNote: null,
            estimatedHours: 12,
          },
        ],
        surcharges: [
          {
            code: 'management_contingency_fixed',
            label: 'Management contingency',
            reason: 'Covers management overhead and contingency.',
            cadence: 'ONE_TIME',
            amount: 300,
          },
          {
            code: 'outside_stack_surcharge',
            label: 'Outside stack surcharge',
            reason: 'Applies when the project uses a stack outside the primary catalog.',
            cadence: 'ONE_TIME',
            amount: 36,
          },
        ],
        discounts: [],
        explanation: [
          {
            stage: 'COMMERCIAL',
            title: 'Stack outside primary catalog',
            description: 'A surcharge was applied because the requested technology is outside the standard stack.',
            amountDelta: 36,
            tone: 'UP',
          },
        ],
      },
    });

    expect(response).toEqual({
      configurationSnapshotId: 'budget-builder-seed-v1',
      previewHash: 'outside-stack-preview',
      modules: [
        {
          id: 'DISCOVERY',
          category: 'analysis_design',
          name: 'Discovery',
          description: 'Initial scoping and solution framing.',
          dependencyIds: [],
          blockingNote: null,
          estimatedHours: 8,
        },
        {
          id: 'CORE_BACKEND',
          category: 'backend',
          name: 'Core backend',
          description: 'Core APIs and business rules.',
          dependencyIds: [],
          blockingNote: null,
          estimatedHours: 12,
        },
      ],
      technicalEstimate: {
        totalHours: 20,
        totalWeeks: 0.6,
      },
      commercialBudget: {
        currency: 'ARS',
        baseAmount: 360,
        oneTimeSubtotal: 696,
        monthlySubtotal: 0,
        surchargeItems: [
          {
            id: 'surcharge-0-management_contingency_fixed',
            code: 'management_contingency_fixed',
            label: 'Management contingency',
            reason: 'Covers management overhead and contingency.',
            cadence: 'one_time',
            amount: 300,
          },
          {
            id: 'surcharge-1-outside_stack_surcharge',
            code: 'outside_stack_surcharge',
            label: 'Outside stack surcharge',
            reason: 'Applies when the project uses a stack outside the primary catalog.',
            cadence: 'one_time',
            amount: 36,
          },
        ],
        discountItems: [],
        finalOneTimeTotal: 696,
        finalMonthlyTotal: 0,
        pricingExplanation: [
          {
            id: 'explanation-0',
            stage: 'COMMERCIAL',
            title: 'Stack outside primary catalog',
            description:
              'A surcharge was applied because the requested technology is outside the standard stack.',
            amountDelta: 36,
            tone: 'UP',
          },
        ],
      },
    });
  });
});
