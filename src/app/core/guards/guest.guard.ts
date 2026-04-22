import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate, CanActivateChild {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    try {
      const hasToken = this.tokenService.hasAccessToken();
      if (hasToken) {
        console.log('✅ Usuario ya autenticado, redirigiendo al dashboard');
        return this.router.createUrlTree(['/']);
      }
      console.log('✅ Usuario no autenticado, permitiendo acceso a login');
      return true;
    } catch (error) {
      console.error('Error en GuestGuard:', error);
      return true;
    }
  }

  canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}
