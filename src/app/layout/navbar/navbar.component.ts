import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { CurrentUserService } from '../../core/services/current-user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private router: Router
  ) {}

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
