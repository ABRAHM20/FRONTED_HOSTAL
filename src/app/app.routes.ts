import { Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';
import { PermissionGuard } from './core/guards/permission.guard';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'users',
        canActivate: [PermissionGuard],
        data: { permissions: ['view.usuarios', 'users.view'] },
        loadChildren: () => import('./features/users/users.routes').then((m) => m.usersRoutes),
      },
      {
        path: 'roles',
        canActivate: [PermissionGuard],
        data: { permissions: ['view.roles', 'roles.view'] },
        loadChildren: () => import('./features/roles/roles.routes').then((m) => m.rolesRoutes),
      },
      {
        path: 'rooms',
        canActivate: [PermissionGuard],
        data: { permissions: ['view.habitaciones'] },
        loadChildren: () => import('./features/rooms/rooms.routes').then((m) => m.roomsRoutes),
      },
      {
        path: 'stays',
        canActivate: [PermissionGuard],
        data: { permissions: ['view.hospedajes'] },
        loadChildren: () => import('./features/stays/stays.routes').then((m) => m.staysRoutes),
      },
      {
        path: 'services',
        canActivate: [PermissionGuard],
        data: { permissions: ['view.servicios'] },
        loadChildren: () => import('./features/hotel-services/hotel-services.routes').then((m) => m.hotelServicesRoutes),
      },
      {
        path: 'payments',
        canActivate: [PermissionGuard],
        data: { permissions: ['view.pagos'] },
        loadChildren: () => import('./features/payments/payments.routes').then((m) => m.paymentsRoutes),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivateChild: [GuestGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/pages/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      {
        path: 'access-denied',
        loadComponent: () =>
          import('./features/auth/pages/access-denied/access-denied.component').then(
            (m) => m.AccessDeniedComponent
          ),
      },
    ],
  },
  {
    path: 'forbidden',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/auth/pages/access-denied/access-denied.component').then(
        (m) => m.AccessDeniedComponent
      ),
  },
  { path: '**', redirectTo: 'dashboard' },
];
