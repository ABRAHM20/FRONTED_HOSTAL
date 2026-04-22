import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentUserService } from '../../core/services/current-user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>¡Bienvenido!</h1>
      <p *ngIf="currentUser">
        Has iniciado sesión como <strong>{{ currentUser.email }}</strong>.
      </p>
      <p>Usa la barra lateral para navegar a las secciones a las que tienes acceso.</p>
      <p *ngIf="!hasPermissions()">
        Actualmente no tienes permisos asignados para ver otras secciones. Por favor, contacta a un administrador.
      </p>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class DashboardComponent {
  currentUser: any = null;

  constructor(private currentUserService: CurrentUserService) {
    this.currentUser = this.currentUserService.getCurrentUserValue();
  }

  hasPermissions(): boolean {
    const permissions = this.currentUser?.permissions;
    return permissions ? permissions.length > 0 : false;
  }
}
