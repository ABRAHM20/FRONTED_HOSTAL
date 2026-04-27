import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { CurrentUser, CurrentUserService } from '../../core/services/current-user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  currentUser$: Observable<CurrentUser | null>;

  constructor(
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private router: Router
  ) {
    this.currentUser$ = this.currentUserService.getCurrentUser();
  }

  getDisplayName(user: CurrentUser): string {
    return user.name || user.full_name || user.email;
  }

  getRoleLabel(user: CurrentUser): string {
    const role = user.roles?.[0]?.name;
    return role ? role : 'Sin rol';
  }

  getInitials(user: CurrentUser): string {
    const base = this.getDisplayName(user).trim();
    if (!base) return 'US';
    const parts = base.split(/\s+/).filter(Boolean);
    const letters = parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0][0];
    return letters.toUpperCase().slice(0, 2);
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      complete: () => {
        console.log('🔓 Sesión cerrada');
        this.currentUserService.clearCurrentUser();
        this.router.navigate(['/auth/login']);
      },
    });
  }
}
