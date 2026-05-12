import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminLoginModalComponent } from './admin-login-modal.component';
import { AuthService } from '../../services/auth.service';

describe('AdminLoginModalComponent', () => {
  let fixture: ComponentFixture<AdminLoginModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AdminLoginModalComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jasmine.createSpy('login'),
            hasAdminAccess: () => true,
            logout: jasmine.createSpy('logout'),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLoginModalComponent);
    fixture.detectChanges();
  });

  it('does not expose the internal FERCHUZ identifier in visible login copy', () => {
    const textContent = fixture.nativeElement.textContent as string;
    const usernameInput = fixture.nativeElement.querySelector('[formControlName="username"]') as HTMLInputElement;

    expect(textContent).not.toContain('FERCHUZ');
    expect(usernameInput.placeholder).toBe('');
  });
});
