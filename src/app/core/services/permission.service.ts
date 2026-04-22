import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Permission {
  id: number;
  name: string;
  display_name?: string;
  action?: string;
  resource?: string;
  module_id?: number;
  created_at?: string;
  updated_at?: string;
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
export class PermissionService {
  constructor(private http: HttpClient) {}

  listPermissions(
    skip: number = 0,
    limit: number = 100,
    moduleId?: number
  ): Observable<PaginatedResponse<Permission>> {
    let url = `${environment.apiUrl}/permissions?skip=${skip}&limit=${limit}`;
    if (moduleId) {
      url += `&module_id=${moduleId}`;
    }
    return this.http.get<PaginatedResponse<Permission>>(url);
  }

  getPermissionById(permissionId: number): Observable<Permission> {
    return this.http.get<Permission>(`${environment.apiUrl}/permissions/${permissionId}`);
  }
}
