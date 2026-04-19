import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest, UserLoginResponse } from '../models/auth.models';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(payload: LoginRequest): Observable<UserLoginResponse> {
    return this.http
      .post<UserLoginResponse>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(tap((response) => this.tokenService.setTokens(response.access_token, response.refresh_token)));
  }

  logout(): Observable<void> {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}).pipe(
      map(() => undefined),
      catchError(() => of(undefined)),
      tap(() => this.tokenService.clearTokens())
    );
  }
}
