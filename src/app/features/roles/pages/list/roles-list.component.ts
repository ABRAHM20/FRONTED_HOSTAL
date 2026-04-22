import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RoleService, Role, PaginatedResponse } from '../../../../core/services/role.service';
import { AlertService } from '../../../../shared/alert/alert.service';
import { RoleModalComponent } from '../modals/role-modal/role-modal.component';
import { RolePermissionsModalComponent } from '../modals/role-permissions-modal/role-permissions-modal.component';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, RoleModalComponent, RolePermissionsModalComponent],
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss'],
})
export class RolesListComponent implements OnInit, OnDestroy {
  roles: Role[] = [];
  loading = false;
  error: string | null = null;
  skip = 0;
  limit = 20;
  total = 0;

  showRoleModal = false;
  editingRole: Role | null = null;

  showPermissionsModal = false;
  selectedRoleForPermissions: Role | null = null;

  private destroy$ = new Subject<void>();

  constructor(private roleService: RoleService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRoles(): void {
    this.loading = true;
    this.error = null;
    this.roleService
      .listRoles(this.skip, this.limit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginatedResponse<Role>) => {
          this.roles = response.items;
          this.total = response.total;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error cargando roles';
          console.error(err);
          this.alertService.error('Error cargando roles');
          this.loading = false;
        },
      });
  }

  openCreateModal(): void {
    this.editingRole = null;
    this.showRoleModal = true;
  }

  openEditModal(role: Role): void {
    this.editingRole = { ...role };
    this.showRoleModal = true;
  }

  closeRoleModal(): void {
    this.showRoleModal = false;
    this.editingRole = null;
  }

  onRoleSaved(): void {
    this.closeRoleModal();
    this.loadRoles();
  }

  deleteRole(role: Role): void {
    if (role.is_system) {
      this.alertService.warning('No se pueden eliminar roles del sistema');
      return;
    }
    if (confirm(`¿Eliminar el rol "${role.name}"?`)) {
      this.roleService
        .deleteRole(role.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadRoles();
            this.alertService.success('Rol eliminado');
          },
          error: (err) => {
            console.error(err);
            this.alertService.error(err?.error?.detail || 'Error al eliminar el rol');
          },
        });
    }
  }

  openPermissionsModal(role: Role): void {
    this.selectedRoleForPermissions = role;
    this.showPermissionsModal = true;
  }

  closePermissionsModal(): void {
    this.showPermissionsModal = false;
    this.selectedRoleForPermissions = null;
  }

  onPermissionsSaved(): void {
    this.closePermissionsModal();
    this.loadRoles();
  }
}
