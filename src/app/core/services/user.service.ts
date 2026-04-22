import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  avatar?: string;
  phone?: string;
  roles?: Role[];
  permissions?: Permission[];
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  is_active?: boolean;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface Permission {
  id: number;
  name: string;
  display_name?: string;
}

export interface PaginatedResponse<T> {
  total: number;
  skip: number;
  limit: number;
  items: T[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  // User CRUD
  listUsers(
    skip: number = 0,
    limit: number = 20,
    onlyActive: boolean = false
  ): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>(
      `${environment.apiUrl}/users?skip=${skip}&limit=${limit}&only_active=${onlyActive}`
    );
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${userId}`);
  }

  createUser(data: UserCreateRequest): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, data);
  }

  updateUser(userId: number, data: UserUpdateRequest): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/${userId}`, data);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/users/${userId}`);
  }

  // User Roles
  assignRoleToUser(userId: number, roleId: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/${userId}/roles`, {
      role_id: roleId,
    });
  }

  removeRoleFromUser(userId: number, roleId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/users/${userId}/roles/${roleId}`);
  }

  // User Permissions
  assignPermissionToUser(userId: number, permissionId: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/users/${userId}/permissions`, {
      permission_id: permissionId,
    });
  }

  removePermissionFromUser(userId: number, permissionId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/users/${userId}/permissions/${permissionId}`
    );
  }
}
