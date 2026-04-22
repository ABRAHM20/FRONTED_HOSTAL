import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    try {
      const hasToken = this.tokenService.hasAccessToken();
      if (hasToken) {
        console.log('✅ Usuario autenticado, acceso permitido');
        return true;
      }
      console.log('❌ No hay token, redirigiendo a login');
      return this.router.createUrlTree(['/auth/login']);
    } catch (error) {
      console.error('Error en AuthGuard:', error);
      return this.router.createUrlTree(['/auth/login']);
    }
  }

  canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}
