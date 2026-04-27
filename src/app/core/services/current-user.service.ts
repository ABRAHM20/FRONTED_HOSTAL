import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

export interface RoleSimple {
  id: number;
  name: string;
  description?: string | null;
}

export interface CurrentUser {
  id: number;
  email: string;
  name?: string;
  full_name?: string;
  roles?: RoleSimple[];
  permissions: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  private currentUser$ = new BehaviorSubject<CurrentUser | null>(null);

  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.loadFromStorage();
    this.refreshCurrentUser();
  }

  /**
   * Guarda el usuario actual y sus permisos
   */
  setCurrentUser(user: CurrentUser): void {
    console.log(`🔐 Usuario actual establecido: ${user.email}`, user.permissions);
    const normalized = {
      ...user,
      name: user.name || user.full_name,
      permissions: user.permissions || [],
      roles: user.roles || [],
    };
    this.currentUser$.next(normalized);
    localStorage.setItem('currentUser', JSON.stringify(normalized));
  }

  /**
   * Obtiene el usuario actual como Observable
   */
  getCurrentUser(): Observable<CurrentUser | null> {
    return this.currentUser$.asObservable();
  }

  /**
   * Obtiene el usuario actual (valor actual, no Observable)
   */
  getCurrentUserValue(): CurrentUser | null {
    return this.currentUser$.value;
  }

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  hasPermission(permissionName: string): boolean {
    const user = this.currentUser$.value;
    if (!user || !user.permissions) {
      return false;
    }
    return user.permissions.includes(permissionName);
  }

  /**
   * Verifica si el usuario tiene alguno de los permisos especificados
   */
  hasAnyPermission(permissionNames: string[]): boolean {
    return permissionNames.some((perm) => this.hasPermission(perm));
  }

  /**
   * Verifica si el usuario tiene todos los permisos especificados
   */
  hasAllPermissions(permissionNames: string[]): boolean {
    return permissionNames.every((perm) => this.hasPermission(perm));
  }

  /**
   * Limpia el usuario actual
   */
  clearCurrentUser(): void {
    console.log('❌ Usuario actual limpiado');
    this.currentUser$.next(null);
    localStorage.removeItem('currentUser');
  }

  /**
   * Carga el usuario del localStorage si existe
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        try {
          const user = JSON.parse(stored) as CurrentUser;
          // Validar que el usuario tiene las propiedades requeridas
          if (user && user.id && user.email && Array.isArray(user.permissions)) {
            console.log(`📥 Usuario cargado del localStorage: ${user.email}`);
            this.currentUser$.next(user);
          } else {
            console.warn('⚠️ Usuario del localStorage no tiene estructura válida');
            localStorage.removeItem('currentUser');
          }
        } catch (parseError) {
          console.error('❌ Error parseando usuario del localStorage:', parseError);
          localStorage.removeItem('currentUser');
        }
      }
    } catch (error) {
      console.error('❌ Error accediendo localStorage:', error);
      // Fallar silenciosamente, el usuario tendrá que hacer login
    }
  }

  private refreshCurrentUser(): void {
    if (!this.tokenService.hasAccessToken()) {
      return;
    }

    this.http.get<CurrentUser>(`${environment.apiUrl}/auth/me`).subscribe({
      next: (user) => {
        const existing = this.currentUser$.value;
        const merged: CurrentUser = {
          ...existing,
          ...user,
          name: user.name || user.full_name || existing?.name || existing?.full_name,
          roles: user.roles && user.roles.length ? user.roles : existing?.roles || [],
          permissions: existing?.permissions || [],
        };
        this.currentUser$.next(merged);
        localStorage.setItem('currentUser', JSON.stringify(merged));
      },
      error: () => {
        // Keep local cached user if refresh fails.
      },
    });
  }
}
