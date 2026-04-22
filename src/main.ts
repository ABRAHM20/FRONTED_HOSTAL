import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { unauthorizedInterceptor } from './app/core/interceptors/unauthorized.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor, unauthorizedInterceptor])),
  ],
}).catch((err) => console.error(err));
