# 🏨 Frontend Hotel API - Angular 17

Cliente web de la aplicación Hotel con autenticación JWT y gestión de roles/permisos.

## 📋 Características

✅ **Autenticación JWT** - Login con email/password  
✅ **Guards de Rutas** - Control de acceso por autenticación y permisos  
✅ **Interceptor HTTP** - Añade token a requests + manejo de refresh  
✅ **Directivas de Permisos** - Mostrar/ocultar UI basado en permisos  
✅ **Servicios Reactivos** - Auth, Permission, API services  
✅ **Seguridad** - Almacenamiento seguro de tokens  
✅ **Responsive** - UI adaptada a dispositivos  

---

## 🚀 Inicio Rápido

### 1. Instalación de dependencias

```bash
cd frontend/fronted_angular
npm install
```

### 2. Configuración de entorno

Editar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

Y `src/environments/environment.prod.ts` para producción.

### 3. Iniciar servidor de desarrollo

```bash
ng serve
```

O con npm:
```bash
npm start
```

La aplicación estará en: `http://localhost:4200`

---

## 📁 Estructura del Proyecto

```
fronted_angular/
├── src/
│   ├── app/
│   │   ├── app.config.ts              # Configuración de la aplicación
│   │   ├── app.routes.ts              # Rutas principales
│   │   ├── app.ts                     # Componente raíz
│   │   ├── services/
│   │   │   ├── auth.service.ts        # Servicio de autenticación
│   │   │   ├── permission.service.ts  # Servicio de permisos
│   │   │   └── api.service.ts         # (crear) Servicio API genérico
│   │   ├── guards/
│   │   │   ├── auth.guard.ts          # Guard de autenticación
│   │   │   └── permission.guard.ts    # Guard de permisos
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts    # Interceptor HTTP
│   │   ├── directives/
│   │   │   └── has-permission.directive.ts  # Directivas de permisos
│   │   ├── components/
│   │   │   ├── login/                 # (crear) Componente login
│   │   │   ├── navbar/                # (crear) Barra de navegación
│   │   │   ├── dashboard/             # (crear) Dashboard principal
│   │   │   ├── usuarios/              # (crear) Gestión de usuarios
│   │   │   └── ...
│   │   ├── models/
│   │   │   ├── user.model.ts          # (crear) Interfaces de usuario
│   │   │   └── ...
│   │   └── shared/
│   │       └── ...
│   ├── environments/
│   │   ├── environment.ts             # Config desarrollo
│   │   └── environment.prod.ts        # Config producción
│   ├── main.ts
│   ├── index.html
│   └── styles.scss
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔐 Servicio de Autenticación

### Usar en componentes

```typescript
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.error = error.error?.detail || 'Error al iniciar sesión';
        this.loading = false;
      }
    });
  }
}
```

---

## 🛡️ Guards de Rutas

### Configurar rutas protegidas

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: { permission: 'view.usuarios' }
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: { role: 'admin' }
  }
];
```

---

## 🎯 Directivas de Permisos

### Mostrar/ocultar botones basado en permisos

```html
<!-- Mostrar solo si tiene el permiso -->
<button *appHasPermission="'create.usuarios'" (click)="createUser()">
  Crear Usuario
</button>

<!-- Mostrar si tiene alguno de los permisos -->
<button *appHasPermission="['edit.usuarios', 'delete.usuarios']" appHasPermissionOp="OR">
  Acciones
</button>

<!-- Mostrar si tiene TODOS los permisos -->
<button *appHasPermission="['edit.usuarios', 'delete.usuarios']" appHasPermissionOp="AND">
  Editar y Eliminar
</button>

<!-- Mostrar basado en rol -->
<div *appHasRole="'admin'">
  Panel Administrativo
</div>

<!-- Mostrar solo si está autenticado -->
<div *appIsAuthenticated>
  Contenido para usuarios autenticados
</div>
```

---

## 🔌 Interceptor HTTP

El `AuthInterceptor` automáticamente:

1. ✅ Añade header `Authorization: Bearer {token}` a cada request
2. ✅ Maneja error 401 (token expirado)
3. ✅ Intenta refrescar el token automáticamente
4. ✅ Reintenta el request original con nuevo token
5. ❌ Si falla el refresh → logout automático

### No afecta a rutas públicas:
- `/api/auth/login`
- `/api/auth/refresh`

---

## 🧪 Validar Permisos en Componentes

```typescript
import { Component, OnInit } from '@angular/core';
import { PermissionService } from './services/permission.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  canCreate = false;
  canEdit = false;
  isAdmin = false;

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.canCreate = this.permissionService.hasPermission('create.usuarios');
    this.canEdit = this.permissionService.hasPermission('edit.usuarios');
    this.isAdmin = this.permissionService.isAdmin();
  }

  deleteUser(id: number): void {
    if (!this.permissionService.hasPermission('delete.usuarios')) {
      alert('No tiene permiso para eliminar usuarios');
      return;
    }
    // Hacer delete...
  }
}
```

---

## 📦 Dependencias Principales

| Paquete | Versión | Propósito |
|---------|---------|----------|
| Angular | 17+ | Framework |
| RxJS | 7.8+ | Reactive Programming |
| TypeScript | 5+ | Lenguaje |

### Instalar Angular Material (opcional para UI)

```bash
ng add @angular/material
```

---

## 🔧 Configuración del app.config.ts

Registrar el interceptor:

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};
```

---

## 🌐 Integración con Backend

### Variable de entorno

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

### Endpoints esperados

- `POST /api/auth/login` → Login
- `POST /api/auth/refresh` → Refresh token
- `POST /api/auth/logout` → Logout
- `GET /api/auth/me` → Usuario actual
- `GET /api/usuarios` → Listar usuarios (requiere `view.usuarios`)
- etc.

---

## 🚀 Build para Producción

```bash
ng build --configuration production
```

Output estará en: `dist/fronted_angular/`

---

## 🐛 Troubleshooting

### "No permission" al acceder a ruta

1. Verificar que el token sea válido
2. Revisar que el usuario tenga el permiso
3. En dev, revisar console del navegador

### "Token expirado" en requests

1. El interceptor intenta refrescar automáticamente
2. Si falla el refresh, se hace logout
3. Verificar que `refresh_token` sea válido

### CORS error

1. Verificar que backend tenga CORS configurado
2. Verificar que `apiUrl` en environment sea correcto
3. Verificar headers de las requests

---

## 📝 Licencia

Privado - Hotel Management System

---

## 👥 Contacto

Para preguntas o issues, contactar al equipo de desarrollo.
