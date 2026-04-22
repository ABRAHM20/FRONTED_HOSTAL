import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService, User, PaginatedResponse } from '../../../../core/services/user.service';
import { UserModalComponent } from '../modals/user-modal/user-modal.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, UserModalComponent],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  skip = 0;
  limit = 20;
  total = 0;

  showUserModal = false;
  editingUser: User | null = null;

  // Expose Math to template
  Math = Math;

  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    this.userService
      .listUsers(this.skip, this.limit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginatedResponse<User>) => {
          this.users = response.items;
          this.total = response.total;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error cargando usuarios';
          console.error(err);
          this.loading = false;
        },
      });
  }

  openCreateModal(): void {
    this.editingUser = null;
    this.showUserModal = true;
  }

  openEditModal(user: User): void {
    this.editingUser = { ...user };
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.editingUser = null;
  }

  onUserSaved(): void {
    this.closeUserModal();
    this.loadUsers();
  }

  deleteUser(user: User): void {
    if (confirm(`¿Eliminar el usuario "${user.name}"?`)) {
      this.userService
        .deleteUser(user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadUsers();
          },
          error: (err) => {
            console.error(err);
            alert('Error al eliminar el usuario');
          },
        });
    }
  }

  toggleUserActive(user: User): void {
    this.userService
      .updateUser(user.id, { is_active: !user.is_active })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          user.is_active = !user.is_active;
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar el usuario');
        },
      });
  }

  previousPage(): void {
    if (this.skip > 0) {
      this.skip -= this.limit;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.skip + this.limit < this.total) {
      this.skip += this.limit;
      this.loadUsers();
    }
  }
}

