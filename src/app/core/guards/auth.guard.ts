import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    return this.tokenService.hasAccessToken()
      ? true
      : this.router.createUrlTree(['/auth/login']);
  }

  canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}
