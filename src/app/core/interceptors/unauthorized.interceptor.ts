import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AlertService } from '../../shared/alert/alert.service';
import { CurrentUserService } from '../services/current-user.service';
import { TokenService } from '../services/token.service';

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const currentUserService = inject(CurrentUserService);
  const router = inject(Router);
  const alertService = inject(AlertService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        tokenService.clearTokens();
        currentUserService.clearCurrentUser();
        alertService.warning('Tu sesión expiró. Inicia sesión nuevamente.');
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
