import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Role {
  id: number;
  name: string;
  description?: string;
  is_system?: boolean;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  id: number;
  name: string;
  display_name?: string;
  action?: string;
  resource?: string;
  module_id?: number;
}

export interface RoleCreateRequest {
  name: string;
  description?: string;
}

export interface RoleUpdateRequest {
  name?: string;
  description?: string;
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
export class RoleService {
  constructor(private http: HttpClient) {}

  // Role CRUD
  listRoles(skip: number = 0, limit: number = 20): Observable<PaginatedResponse<Role>> {
    return this.http.get<PaginatedResponse<Role>>(
      `${environment.apiUrl}/roles?skip=${skip}&limit=${limit}`
    );
  }

  getRoleById(roleId: number): Observable<Role> {
    return this.http.get<Role>(`${environment.apiUrl}/roles/${roleId}`);
  }

  createRole(data: RoleCreateRequest): Observable<Role> {
    return this.http.post<Role>(`${environment.apiUrl}/roles`, data);
  }

  updateRole(roleId: number, data: RoleUpdateRequest): Observable<Role> {
    return this.http.put<Role>(`${environment.apiUrl}/roles/${roleId}`, data);
  }

  deleteRole(roleId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/roles/${roleId}`);
  }

  // Role Permissions
  getRolePermissions(roleId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${environment.apiUrl}/roles/${roleId}/permissions`);
  }

  assignPermissionToRole(roleId: number, permissionId: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/roles/${roleId}/permissions`, {
      permission_id: permissionId,
    });
  }

  removePermissionFromRole(roleId: number, permissionId: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/roles/${roleId}/permissions/${permissionId}`
    );
  }
}
