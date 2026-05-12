import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login-modal',
  standalone: false,
  templateUrl: './admin-login-modal.component.html',
  styleUrl: './admin-login-modal.component.scss',
})
export class AdminLoginModalComponent implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly languageService = inject(LanguageService);
  private readonly authService = inject(AuthService);

  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly authenticated = new EventEmitter<void>();

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly content = computed(() =>
    this.languageService.language() === 'es'
      ? {
          badge: 'Acceso privado',
          title: 'Ingreso privado',
          description:
            'Autenticación segura para acceder al Centro de Mando sin alterar la experiencia pública del portfolio.',
          visualTitle: 'Control Center',
          visualLead: 'Acceso operativo al backoffice, mensajeria y herramientas privadas.',
          visualChips: ['Sesion segura', 'Panel privado', 'Backend real'],
          usernameLabel: 'Usuario',
          passwordLabel: 'Contraseña',
          usernamePlaceholder: '',
          passwordPlaceholder: 'Ingresa tu contraseña',
          helper: 'Se utilizará `POST /api/auth/login` y se almacenará el JWT en la sesión local del navegador.',
          cancelLabel: 'Cancelar',
          submitLabel: 'Ingresar',
          submittingLabel: 'Validando acceso...',
          invalidRoleMessage: 'La cuenta autenticada no tiene permisos de administración.',
          defaultErrorMessage: 'No se pudo iniciar sesión. Verifica tus credenciales e intenta nuevamente.',
          closeAriaLabel: 'Cerrar modal de acceso privado',
        }
      : {
          badge: 'Private access',
          title: 'Private login',
          description:
            'Secure authentication to reach the Control Center without affecting the public portfolio experience.',
          visualTitle: 'Control Center',
          visualLead: 'Operational access to the backoffice, messaging, and private tools.',
          visualChips: ['Secure session', 'Private panel', 'Real backend'],
          usernameLabel: 'Username',
          passwordLabel: 'Password',
          usernamePlaceholder: '',
          passwordPlaceholder: 'Enter your password',
          helper: 'This will call `POST /api/auth/login` and store the JWT in the browser local session.',
          cancelLabel: 'Cancel',
          submitLabel: 'Sign in',
          submittingLabel: 'Validating access...',
          invalidRoleMessage: 'The authenticated account does not have admin permissions.',
          defaultErrorMessage: 'Login failed. Check your credentials and try again.',
          closeAriaLabel: 'Close private access modal',
        },
  );

  readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(80)]],
    password: ['', [Validators.required, Validators.maxLength(255)]],
  });

  ngAfterViewInit(): void {
    const activeElement = this.elementRef.nativeElement.querySelector(
      '[formControlName="username"]',
    ) as HTMLInputElement | null;

    globalThis.document?.body.style.setProperty('overflow', 'hidden');
    activeElement?.focus();
  }

  ngOnDestroy(): void {
    globalThis.document?.body.style.removeProperty('overflow');
  }

  submit(): void {
    if (this.submitting()) {
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const rawValue = this.loginForm.getRawValue();
    const username = rawValue.username.trim();

    if (!username) {
      this.loginForm.controls.username.setErrors({ required: true });
      this.loginForm.controls.username.markAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.authService
      .login({
        username,
        password: rawValue.password,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (session) => {
          if (!this.authService.hasAdminAccess(session.role)) {
            this.authService.logout();
            this.errorMessage.set(this.content().invalidRoleMessage);
            return;
          }

          this.loginForm.patchValue({ password: '' });
          this.authenticated.emit();
        },
        error: (error) => {
          this.errorMessage.set(this.resolveErrorMessage(error));
        },
      });
  }

  close(): void {
    if (this.submitting()) {
      return;
    }

    this.errorMessage.set(null);
    this.loginForm.patchValue({ password: '' });
    this.closed.emit();
  }

  preventClose(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  private resolveErrorMessage(error: unknown): string {
    if (
      error instanceof HttpErrorResponse &&
      error.error &&
      typeof error.error.message === 'string' &&
      error.error.message.trim().length > 0
    ) {
      return error.error.message;
    }

    return this.content().defaultErrorMessage;
  }
}
