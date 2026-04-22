import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CurrentUserService } from '../../../../core/services/current-user.service';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss',
})
export class AccessDeniedComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private currentUserService: CurrentUserService
  ) {}

  goHome(): void {
    this.router.navigate(['/users']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      complete: () => {
        console.log('🔓 Sesión cerrada');
        this.currentUserService.clearCurrentUser();
        this.router.navigate(['/auth/login']);
      },
    });
  }
}
