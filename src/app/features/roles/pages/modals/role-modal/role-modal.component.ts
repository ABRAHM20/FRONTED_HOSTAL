import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RoleService, Role, RoleCreateRequest, RoleUpdateRequest } from '../../../../../core/services/role.service';

@Component({
  selector: 'app-role-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss'],
})
export class RoleModalComponent implements OnInit, OnDestroy {
  @Input() role: Role | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  isEditing = false;
  loading = false;
  error: string | null = null;

  formData = {
    name: '',
    description: '',
  };

  private destroy$ = new Subject<void>();

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    if (this.role) {
      this.isEditing = true;
      this.formData = {
        name: this.role.name,
        description: this.role.description || '',
      };
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

  onClose(): void {
    this.close.emit();
  }
}
