import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RoleService, Role, RoleCreateRequest, RoleUpdateRequest } from '../../../../../core/services/role.service';
import { Permission, PermissionService, PaginatedResponse } from '../../../../../core/services/permission.service';

interface PermissionWithStatus extends Permission {
  assigned?: boolean;
}

@Component({
  selector: 'app-role-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss'],
})
export class RoleModalComponent implements OnInit, OnDestroy {
  @Input() role: Role | null = null;
  @Input() initialTab: 'basic' | 'permissions' = 'basic';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  isEditing = false;
  loading = false;
  error: string | null = null;
  activeTab: 'basic' | 'permissions' = 'basic';

  permissions: PermissionWithStatus[] = [];
  assignedPermissionIds: Set<number> = new Set();
  permissionsLoading = false;
  permissionsError: string | null = null;
  searchText = '';
  expandedResources: Set<string> = new Set();
  permissionsLoaded = false;

  formData = {
    name: '',
    description: '',
  };

  private destroy$ = new Subject<void>();

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    if (this.role) {
      this.isEditing = true;
      this.formData = {
        name: this.role.name,
        description: this.role.description || '',
      };
    }

    this.activeTab = this.initialTab;
    if (this.activeTab === 'permissions' && this.isEditing) {
      this.loadPermissionsAndAssignments();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (!this.formData.name.trim()) {
      this.error = 'El nombre del rol es requerido';
      return;
    }

    this.loading = true;
    this.error = null;

    if (this.isEditing && this.role) {
      const updateData: RoleUpdateRequest = {
        name: this.formData.name,
        description: this.formData.description || undefined,
      };

      this.roleService
        .updateRole(this.role.id, updateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.save.emit();
          },
          error: (err) => {
            console.error(err);
            this.error = err.error?.detail || 'Error al actualizar el rol';
            this.loading = false;
          },
        });
    } else {
      const createData: RoleCreateRequest = {
        name: this.formData.name,
        description: this.formData.description || undefined,
      };

      this.roleService
        .createRole(createData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.save.emit();
          },
          error: (err) => {
            console.error(err);
            this.error = err.error?.detail || 'Error al crear el rol';
            this.loading = false;
          },
        });
    }
  }

  setActiveTab(tab: 'basic' | 'permissions'): void {
    if (tab === 'permissions' && !this.isEditing) {
      return;
    }
    this.activeTab = tab;
    if (tab === 'permissions' && this.isEditing) {
      this.loadPermissionsAndAssignments();
    }
  }

  loadPermissionsAndAssignments(): void {
    if (!this.role || this.permissionsLoaded) {
      return;
    }
    this.permissionsLoading = true;
    this.permissionsError = null;

    this.permissionService
      .listPermissions(0, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginatedResponse<Permission>) => {
          this.permissions = response.items as PermissionWithStatus[];
          if (!this.role) {
            return;
          }
          this.roleService
            .getRolePermissions(this.role.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (assignedPerms: Permission[]) => {
                this.assignedPermissionIds = new Set(assignedPerms.map((p) => p.id));
                this.permissions = this.permissions.map((p) => ({
                  ...p,
                  assigned: this.assignedPermissionIds.has(p.id),
                }));

                const resources = new Set(this.permissions.map((p) => p.resource || 'Otros'));
                this.expandedResources = resources;
                this.permissionsLoaded = true;
                this.permissionsLoading = false;
              },
              error: (err) => {
                console.error('Error loading assigned permissions:', err);
                this.permissionsError = 'Error cargando permisos asignados';
                this.permissionsLoading = false;
              },
            });
        },
        error: (err) => {
          console.error('Error loading permissions:', err);
          this.permissionsError = 'Error cargando permisos';
          this.permissionsLoading = false;
        },
      });
  }

  togglePermission(permission: PermissionWithStatus): void {
    if (!this.role) {
      return;
    }
    const isAssigned = this.assignedPermissionIds.has(permission.id);
    const permIndex = this.permissions.findIndex((p) => p.id === permission.id);

    if (isAssigned) {
      this.roleService
        .removePermissionFromRole(this.role.id, permission.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.assignedPermissionIds.delete(permission.id);
            if (permIndex >= 0) {
              this.permissions[permIndex].assigned = false;
              this.permissions = [...this.permissions];
            }
            this.permissionsError = null;
          },
          error: (err) => {
            console.error('Error removiendo permiso:', err);
            this.permissionsError = `Error al remover permiso: ${err.error?.detail || err.message || 'Desconocido'}`;
          },
        });
    } else {
      this.roleService
        .assignPermissionToRole(this.role.id, permission.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.assignedPermissionIds.add(permission.id);
            if (permIndex >= 0) {
              this.permissions[permIndex].assigned = true;
              this.permissions = [...this.permissions];
            }
            this.permissionsError = null;
          },
          error: (err) => {
            console.error('Error asignando permiso:', err);
            this.permissionsError = `Error al asignar permiso: ${err.error?.detail || err.message || 'Desconocido'}`;
          },
        });
    }
  }

  toggleResourceExpand(resource: string | undefined): void {
    if (!resource) {
      return;
    }
    if (this.expandedResources.has(resource)) {
      this.expandedResources.delete(resource);
    } else {
      this.expandedResources.add(resource);
    }
  }

  isResourceExpanded(resource: string | undefined): boolean {
    return resource ? this.expandedResources.has(resource) : false;
  }

  getGroupedPermissions(): { [key: string]: PermissionWithStatus[] } {
    const filtered = this.permissions.filter((p) =>
      (p.name?.toLowerCase() || '').includes(this.searchText.toLowerCase())
    );

    const grouped: { [key: string]: PermissionWithStatus[] } = {};
    filtered.forEach((p) => {
      const resource = p.resource || 'Otros';
      if (!grouped[resource]) {
        grouped[resource] = [];
      }
      grouped[resource].push(p);
    });
    return grouped;
  }

  getAssignedCount(permissions: PermissionWithStatus[]): number {
    return permissions.filter((permission) => permission.assigned).length;
  }

  onPermissionsDone(): void {
    this.save.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
