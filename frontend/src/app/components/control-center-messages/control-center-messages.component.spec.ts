import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { ControlCenterMessagesComponent } from './control-center-messages.component';
import {
  ContactAdminService,
  ContactMessageDetail,
  ContactMessageSummary,
} from '../../services/contact-admin.service';
import { LanguageService } from '../../services/language.service';

describe('ControlCenterMessagesComponent', () => {
  let fixture: ComponentFixture<ControlCenterMessagesComponent>;
  let component: ControlCenterMessagesComponent;
  let contactAdminService: jasmine.SpyObj<ContactAdminService>;

  const messages: ContactMessageSummary[] = [
    {
      id: '1',
      name: 'Ana Cliente',
      email: 'ana@example.com',
      subject: 'Consulta freelance',
      messagePreview: 'Necesito una propuesta para una web interna.',
      status: 'NEW',
      language: 'es',
      context: 'contact-form',
      createdAt: '2026-04-20T10:00:00Z',
      repliedAt: null,
    },
    {
      id: '2',
      name: 'John Team',
      email: 'john@example.com',
      subject: 'Partnership request',
      messagePreview: 'We would like to discuss a possible collaboration for a new delivery platform.',
      status: 'REPLIED',
      language: 'en',
      context: 'projects',
      createdAt: '2026-04-19T08:30:00Z',
      repliedAt: '2026-04-19T09:00:00Z',
    },
  ];

  const messageDetail: ContactMessageDetail = {
    ...messages[0],
    message: 'Necesito una propuesta para una web interna.',
    source: 'portfolio-web',
    userAgent: 'Chrome',
    submittedAt: '2026-04-20T10:00:00Z',
    replyMessage: null,
    repliedBy: null,
    updatedAt: '2026-04-20T10:00:00Z',
  };

  beforeEach(async () => {
    contactAdminService = jasmine.createSpyObj<ContactAdminService>('ContactAdminService', [
      'listMessages',
      'getMessage',
      'updateStatus',
      'reply',
      'deleteMessage',
    ]);

    contactAdminService.listMessages.and.returnValue(of({ success: true, message: 'ok', data: messages }));
    contactAdminService.getMessage.and.returnValue(of({ success: true, message: 'ok', data: messageDetail }));
    contactAdminService.updateStatus.and.returnValue(of({ success: true, message: 'ok', data: { ...messageDetail, status: 'READ' } }));
    contactAdminService.reply.and.returnValue(
      of({
        success: true,
        message: 'ok',
        data: {
          ...messageDetail,
          status: 'REPLIED',
          replyMessage: 'Gracias por escribir.',
          repliedBy: 'ferchuz',
          repliedAt: '2026-04-20T10:30:00Z',
          updatedAt: '2026-04-20T10:30:00Z',
        },
      }),
    );
    contactAdminService.deleteMessage.and.returnValue(of({ success: true, message: 'ok', data: null }));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ControlCenterMessagesComponent],
      providers: [
        {
          provide: ContactAdminService,
          useValue: contactAdminService,
        },
        {
          provide: LanguageService,
          useValue: {
            language: () => 'es',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlCenterMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('loads inbox messages and selects the first visible message', () => {
    expect(contactAdminService.listMessages).toHaveBeenCalled();
    expect(contactAdminService.getMessage).toHaveBeenCalledWith('1');
    expect(component.visibleMessages().length).toBe(2);
    expect(component.selectedMessageId()).toBe('1');
    expect(component.visibleMessages()[0].messagePreview).toContain('propuesta');
    expect(component.filterOptions().find((filter) => filter.id === 'NEW')?.count).toBe(1);
    expect(component.filterOptions().find((filter) => filter.id === 'SPAM')?.count).toBe(0);
    expect(component.filterOptions().find((filter) => filter.id === 'TRASH')?.count).toBe(0);
  });

  it('filters visible messages locally by search term and status', async () => {
    await component.updateSearchTerm('john');

    expect(component.visibleMessages().map((message) => message.id)).toEqual(['2']);

    await component.updateSearchTerm('collaboration');

    expect(component.visibleMessages().map((message) => message.id)).toEqual(['2']);

    await component.selectFilter('REPLIED');

    expect(component.visibleMessages().map((message) => message.id)).toEqual(['2']);
    expect(component.selectedMessageId()).toBe('2');
  });

  it('submits a reply and updates the selected message state', async () => {
    component.replyForm.setValue({
      subject: 'Re: Consulta freelance',
      message: 'Gracias por escribir.',
    });

    await component.submitReply();

    expect(contactAdminService.reply).toHaveBeenCalledWith('1', 'Gracias por escribir.', 'Re: Consulta freelance');
    expect(component.selectedMessage()?.status).toBe('REPLIED');
    expect(component.actionFeedback()).toBe('Respuesta enviada correctamente.');
  });

  it('marks a selected message as junk', async () => {
    contactAdminService.updateStatus.and.returnValue(
      of({ success: true, message: 'ok', data: { ...messageDetail, status: 'SPAM' } }),
    );
    contactAdminService.listMessages.and.returnValue(
      of({
        success: true,
        message: 'ok',
        data: [{ ...messages[0], status: 'SPAM' }, messages[1]],
      }),
    );

    await component.markSpam();

    expect(contactAdminService.updateStatus).toHaveBeenCalledWith('1', 'SPAM');
    expect(component.messages().find((message) => message.id === '1')?.status).toBe('SPAM');
  });

  it('moves a selected message to trash when delete is used outside trash', async () => {
    contactAdminService.updateStatus.and.returnValue(
      of({ success: true, message: 'ok', data: { ...messageDetail, status: 'TRASH' } }),
    );

    await component.deleteSelectedMessage();

    expect(contactAdminService.updateStatus).toHaveBeenCalledWith('1', 'TRASH');
    expect(contactAdminService.deleteMessage).not.toHaveBeenCalled();
  });

  it('deletes a selected message permanently from trash', async () => {
    component.selectedMessageId.set('1');
    component.selectedMessage.set({ ...messageDetail, status: 'TRASH' });

    await component.deleteSelectedMessage();

    expect(contactAdminService.deleteMessage).toHaveBeenCalledWith('1');
    expect(component.messages().some((message) => message.id === '1')).toBeFalse();
  });
});
