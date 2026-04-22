import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService, User, UserCreateRequest, UserUpdateRequest } from '../../../../../core/services/user.service';
import { RoleService, Role, PaginatedResponse } from '../../../../../core/services/role.service';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent implements OnInit, OnDestroy {
  @Input() user: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  isEditing = false;
  loading = false;
  error: string | null = null;
  loadingRoles = false;
  roles: Role[] = [];
  selectedRoleId: number | null = null;

  formData = {
    name: '',
    email: '',
    password: '',
    phone: '',
  };

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    if (this.user) {
      this.isEditing = true;
      this.formData = {
        name: this.user.name,
        email: this.user.email,
        password: '',
        phone: this.user.phone || '',
      };
      if (this.user.roles && this.user.roles.length > 0) {
        this.selectedRoleId = this.user.roles[0].id;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRoles(): void {
    this.loadingRoles = true;
    this.roleService
      .listRoles(0, 100)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginatedResponse<Role>) => {
          this.roles = response.items;
          this.loadingRoles = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Error cargando roles';
          this.loadingRoles = false;
        },
      });
  }

  onSubmit(): void {
    if (!this.formData.name.trim()) {
      this.error = 'El nombre es requerido';
      return;
    }
    if (!this.formData.email.trim()) {
      this.error = 'El email es requerido';
      return;
    }
    if (!this.isEditing && !this.formData.password.trim()) {
      this.error = 'La contraseña es requerida para nuevos usuarios';
      return;
    }
    if (!this.isEditing && this.formData.password.length < 8) {
      this.error = 'La contraseña debe tener mínimo 8 caracteres';
      return;
    }
    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      this.error = 'El email no es válido';
      return;
    }

    this.loading = true;
    this.error = null;

    if (this.isEditing && this.user) {
      const updateData: UserUpdateRequest = {
        name: this.formData.name.trim(),
        email: this.formData.email.trim(),
        phone: this.formData.phone?.trim() || undefined,
      };

      this.userService
        .updateUser(this.user.id, updateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log(`✓ Usuario actualizado: ${this.user!.email}`);
            // Asignar rol si se seleccionó uno y cambió
            if (this.selectedRoleId) {
              const currentRoleId = this.user?.roles?.[0]?.id;
              if (currentRoleId !== this.selectedRoleId) {
                console.log(`Cambiando rol de ${currentRoleId} a ${this.selectedRoleId}`);
                if (currentRoleId) {
                  this.userService
                    .removeRoleFromUser(this.user!.id, currentRoleId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                      next: () => {
                        console.log(`✓ Rol anterior removido: ${currentRoleId}`);
                        this.userService
                          .assignRoleToUser(this.user!.id, this.selectedRoleId!)
                          .pipe(takeUntil(this.destroy$))
                          .subscribe({
                            next: () => {
                              console.log(`✓ Nuevo rol asignado: ${this.selectedRoleId}`);
                              this.loading = false;
                              this.save.emit();
                            },
                            error: (err) => {
                              console.error('Error asignando nuevo rol:', err);
                              this.error = `Error asignando rol: ${err.error?.detail || 'Desconocido'}`;
                              this.loading = false;
                            },
                          });
                      },
                      error: (err) => {
                        console.error('Error removiendo rol anterior:', err);
                        this.error = `Error removiendo rol anterior: ${err.error?.detail || 'Desconocido'}`;
                        this.loading = false;
                      },
                    });
                } else {
                  this.userService
                    .assignRoleToUser(this.user!.id, this.selectedRoleId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                      next: () => {
                        console.log(`✓ Rol asignado: ${this.selectedRoleId}`);
                        this.loading = false;
                        this.save.emit();
                      },
                      error: (err) => {
                        console.error('Error asignando rol:', err);
                        this.error = `Error asignando rol: ${err.error?.detail || 'Desconocido'}`;
                        this.loading = false;
                      },
                    });
                }
              } else {
                console.log('El rol no cambió');
                this.loading = false;
                this.save.emit();
              }
            } else {
              this.loading = false;
              this.save.emit();
            }
          },
          error: (err) => {
            console.error('Error actualizando usuario:', err);
            this.error = err.error?.detail || 'Error al actualizar el usuario';
            this.loading = false;
          },
        });
    } else {
      const createData: UserCreateRequest = {
        name: this.formData.name.trim(),
        email: this.formData.email.trim(),
        password: this.formData.password,
        phone: this.formData.phone?.trim() || undefined,
      };

      this.userService
        .createUser(createData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (newUser) => {
            console.log(`✓ Usuario creado: ${newUser.email} (ID: ${newUser.id})`);
            // Asignar rol si se seleccionó uno
            if (this.selectedRoleId) {
              console.log(`Asignando rol ${this.selectedRoleId} al usuario ${newUser.id}`);
              this.userService
                .assignRoleToUser(newUser.id, this.selectedRoleId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: () => {
                    console.log(`✓ Rol asignado correctamente al usuario ${newUser.id}`);
                    this.loading = false;
                    this.save.emit();
                  },
                  error: (err) => {
                    console.error('Error asignando rol:', err);
                    this.error = `Usuario creado pero error al asignar rol: ${err.error?.detail || 'Desconocido'}`;
                    this.loading = false;
                  },
                });
            } else {
              console.log('Ningún rol seleccionado');
              this.loading = false;
              this.save.emit();
            }
          },
          error: (err) => {
            console.error('Error creando usuario:', err);
            this.error = err.error?.detail || 'Error al crear el usuario';
            this.loading = false;
          },
        });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
