import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Role, RoleService } from '../../../../../core/services/role.service';
import { Permission, PermissionService, PaginatedResponse } from '../../../../../core/services/permission.service';

interface PermissionWithStatus extends Permission {
  assigned?: boolean;
}

@Component({
  selector: 'app-role-permissions-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-permissions-modal.component.html',
  styleUrls: ['./role-permissions-modal.component.scss'],
})
export class RolePermissionsModalComponent implements OnInit, OnDestroy {
  @Input() role!: Role;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  permissions: PermissionWithStatus[] = [];
  assignedPermissionIds: Set<number> = new Set();
  loading = false;
  saving = false;
  error: string | null = null;
  searchText = '';
  expandedResources: Set<string> = new Set();

  private destroy$ = new Subject<void>();

  constructor(
    private permissionService: PermissionService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.loadPermissionsAndAssignments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPermissionsAndAssignments(): void {
    this.loading = true;
    this.error = null;

    this.permissionService
      .listPermissions(0, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginatedResponse<Permission>) => {
          this.permissions = response.items as PermissionWithStatus[];
          this.roleService
            .getRolePermissions(this.role.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (assignedPerms: Permission[]) => {
                console.log('Permisos asignados:', assignedPerms);
                this.assignedPermissionIds = new Set(assignedPerms.map((p) => p.id));
                this.permissions = this.permissions.map((p) => ({
                  ...p,
                  assigned: this.assignedPermissionIds.has(p.id),
                }));
                console.log('Permisos completos:', this.permissions);
                
                // Expandir todos los recursos automáticamente al cargar
                const resources = new Set(this.permissions.map((p) => p.resource || 'Otros'));
                this.expandedResources = resources;
                
                this.loading = false;
              },
              error: (err) => {
                console.error('Error loading assigned permissions:', err);
                this.error = 'Error cargando permisos asignados';
                this.loading = false;
              },
            });
        },
        error: (err) => {
          console.error('Error loading permissions:', err);
          this.error = 'Error cargando permisos';
          this.loading = false;
        },
      });
  }

  togglePermission(permission: Permission): void {
    const isAssigned = this.assignedPermissionIds.has(permission.id);
    const permIndex = this.permissions.findIndex((p) => p.id === permission.id);
    
    console.log(`Toggle permiso ${permission.name}: ${isAssigned ? 'remove' : 'add'}`);

    if (isAssigned) {
      // Remover permiso
      this.roleService
        .removePermissionFromRole(this.role.id, permission.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log(`✓ Permiso removido: ${permission.name}`);
            this.assignedPermissionIds.delete(permission.id);
            if (permIndex >= 0) {
              this.permissions[permIndex].assigned = false;
              // Forzar detección de cambios
              this.permissions = [...this.permissions];
            }
            this.error = null;
          },
          error: (err) => {
            console.error('Error removiendo permiso:', err);
            this.error = `Error al remover permiso: ${err.error?.detail || err.message || 'Desconocido'}`;
          },
        });
    } else {
      // Asignar permiso
      this.roleService
        .assignPermissionToRole(this.role.id, permission.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log(`✓ Permiso asignado: ${permission.name}`);
            this.assignedPermissionIds.add(permission.id);
            if (permIndex >= 0) {
              this.permissions[permIndex].assigned = true;
              // Forzar detección de cambios
              this.permissions = [...this.permissions];
            }
            this.error = null;
          },
          error: (err) => {
            console.error('Error asignando permiso:', err);
            this.error = `Error al asignar permiso: ${err.error?.detail || err.message || 'Desconocido'}`;
          },
        });
    }
  }

  toggleResourceExpand(resource: string | undefined): void {
    if (!resource) return;
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

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    this.save.emit();
  }
}
