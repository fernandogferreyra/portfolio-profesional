import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'portfolio-admin-session';
  private readonly adminRoles = new Set(['ROLE_FERCHUZ']);
  private readonly sessionState = signal<AuthSession | null>(this.restoreSession());

  readonly session = computed(() => {
    const currentSession = this.sessionState();

    if (!currentSession || this.isExpired(currentSession)) {
      return null;
    }

    return currentSession;
  });

  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly isAdmin = computed(() => this.hasAdminAccess(this.session()?.role));

  login(credentials: LoginCredentials): Observable<AuthSession> {
    return this.http.post<ApiResponse<AuthSession>>('/api/auth/login', credentials).pipe(
      map((response) => response.data),
      tap((session) => this.persistSession(session)),
    );
  }

  logout(): void {
    this.clearSession();
  }

  authorizationHeader(): string | null {
    const currentSession = this.session();

    if (!currentSession) {
      this.clearSession();
      return null;
    }

    const tokenType = currentSession.tokenType || 'Bearer';
    return `${tokenType} ${currentSession.accessToken}`;
  }

  private persistSession(session: AuthSession): void {
    this.sessionState.set(session);

    try {
      globalThis.localStorage?.setItem(this.storageKey, JSON.stringify(session));
    } catch {
      // Ignore storage failures and keep the in-memory session available.
    }
  }

  private restoreSession(): AuthSession | null {
    try {
      const storedValue = globalThis.localStorage?.getItem(this.storageKey);

      if (!storedValue) {
        return null;
      }

      const session = JSON.parse(storedValue) as Partial<AuthSession>;

      if (!this.isSessionShape(session) || this.isExpired(session)) {
        this.removeStoredSession();
        return null;
      }

      return session;
    } catch {
      this.removeStoredSession();
      return null;
    }
  }

  private clearSession(): void {
    this.sessionState.set(null);
    this.removeStoredSession();
  }

  private removeStoredSession(): void {
    try {
      globalThis.localStorage?.removeItem(this.storageKey);
    } catch {
      // Ignore storage failures to avoid breaking logout.
    }
  }

  private isExpired(session: Pick<AuthSession, 'expiresAt'>): boolean {
    const expiresAt = Date.parse(session.expiresAt);
    return !Number.isFinite(expiresAt) || expiresAt <= Date.now();
  }

  private isSessionShape(session: Partial<AuthSession>): session is AuthSession {
    return Boolean(
      session.accessToken &&
        session.username &&
        session.role &&
        session.expiresAt &&
        typeof session.tokenType === 'string',
    );
  }

  hasAdminAccess(role: string | null | undefined): boolean {
    return typeof role === 'string' && this.adminRoles.has(role);
  }
}
