import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import { CurrentUserService } from '../../../../core/services/current-user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.form.invalid || this.loading) {
      return;
    }

    this.error = '';
    this.loading = true;

    const { email, password } = this.form.getRawValue();
    this.authService
      .login({ email: email ?? '', password: password ?? '' })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          console.log(`✓ Login exitoso`, response);
          // Guardar usuario y sus permisos
          this.currentUserService.setCurrentUser({
            id: response.user.id,
            email: response.user.email,
            full_name: response.user.full_name,
            permissions: response.user.permissions || [],
          });
          console.log(`📋 Permisos cargados: ${response.user.permissions?.join(', ') || 'ninguno'}`);
          this.router.navigate(['/dashboard']);
        },
        error: (err: HttpErrorResponse) => {
          this.error = err?.error?.detail ?? 'No se pudo iniciar sesion.';
        },
      });
  }
}
