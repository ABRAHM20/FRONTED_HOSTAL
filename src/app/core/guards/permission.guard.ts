import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CurrentUserService } from '../services/current-user.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    try {
      const user = this.currentUserService.getCurrentUserValue();

      if (!user || !user.permissions) {
        console.log('❌ No hay usuario logueado o permisos no cargados');
        this.router.navigate(['/auth/login']);
        return false;
      }

      // Si la ruta requiere permisos específicos
      const requiredPermissions = route.data['permissions'] as string[] | undefined;
      
      if (requiredPermissions && requiredPermissions.length > 0) {
        // Verificar si el usuario tiene alguno de los permisos requeridos
        const hasPermission = requiredPermissions.some((perm) =>
          this.currentUserService.hasPermission(perm)
        );

        if (!hasPermission) {
          console.log(`❌ Usuario no tiene permisos requeridos: ${requiredPermissions.join(', ')}`);
          console.log(`📋 Permisos disponibles: ${user.permissions?.join(', ') || 'ninguno'}`);
          this.router.navigate(['/access-denied']);
          return false;
        }

        console.log(`✅ Usuario tiene permisos para acceder: ${requiredPermissions.join(', ')}`);
      }

      return true;
    } catch (error) {
      console.error('❌ Error en PermissionGuard:', error);
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
