import { Routes } from '@angular/router';

import { UsersCreateComponent } from './pages/create/users-create.component';
import { UsersEditComponent } from './pages/edit/users-edit.component';
import { UsersListComponent } from './pages/list/users-list.component';

export const usersRoutes: Routes = [
  { path: '', component: UsersListComponent },
  { path: 'create', component: UsersCreateComponent },
  { path: ':id/edit', component: UsersEditComponent },
];
