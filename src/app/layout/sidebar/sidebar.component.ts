import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CurrentUser, CurrentUserService } from '../../core/services/current-user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentUser: CurrentUser | null = null;
  private destroy$ = new Subject<void>();

  constructor(private currentUserService: CurrentUserService) {}

  ngOnInit(): void {
    // Suscribirse a cambios del usuario actual
    this.currentUserService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
        if (user) {
          console.log(`📊 Sidebar actualizado para: ${user.email}`);
          console.log(`📋 Permisos disponibles:`, user.permissions);
        }
      });
  }

  /**
   * Verifica si el usuario tiene permiso para ver usuarios
   */
  canViewUsers(): boolean {
    if (!this.currentUser) return false;
    return this.hasPermissionContaining(['usuarios', 'users']);
  }

  /**
   * Verifica si el usuario tiene permiso para ver roles
   */
  canViewRoles(): boolean {
    if (!this.currentUser) return false;
    return this.hasPermissionContaining(['roles', 'role']);
  }

  /**
   * Verifica si el usuario tiene permiso para ver habitaciones
   */
  canViewRooms(): boolean {
    if (!this.currentUser) return false;
    return this.hasPermissionContaining(['habitaciones']);
  }

  /**
   * Verifica si el usuario tiene permiso para ver hospedajes
   */
  canViewStays(): boolean {
    if (!this.currentUser) return false;
    return this.hasPermissionContaining(['hospedajes', 'estadias']);
  }

  /**
   * Verifica si el usuario tiene permiso para ver servicios
   */
  canViewServices(): boolean {
    if (!this.currentUser) return false;
    return this.hasPermissionContaining(['servicios']);
  }

  /**
   * Verifica si el usuario tiene permiso para ver pagos
   */
  canViewPayments(): boolean {
    if (!this.currentUser) return false;
    return this.hasPermissionContaining(['pagos']);
  }

  /**
   * Verifica si el usuario tiene algún permiso que contenga las palabras clave
   */
  private hasPermissionContaining(keywords: string[]): boolean {
    if (!this.currentUser?.permissions) return false;
    return this.currentUser.permissions.some((perm) =>
      keywords.some((keyword) => perm.toLowerCase().includes(keyword.toLowerCase()))
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
