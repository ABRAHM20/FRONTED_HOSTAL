import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stay, StayCreate, StayUpdate } from '../models/stay.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StayService {
  private apiUrl = `${environment.apiUrl}/stays`;

  constructor(private http: HttpClient) {}

  getStays(skip: number = 0, limit: number = 20, status?: string, roomId?: number): Observable<Stay[]> {
    let url = `${this.apiUrl}?skip=${skip}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    if (roomId) {
      url += `&room_id=${roomId}`;
    }
    return this.http.get<Stay[]>(url);
  }

  getStay(id: number): Observable<Stay> {
    return this.http.get<Stay>(`${this.apiUrl}/${id}`);
  }

  createStay(data: StayCreate): Observable<Stay> {
    return this.http.post<Stay>(`${this.apiUrl}`, data);
  }

  updateStay(id: number, data: StayUpdate): Observable<Stay> {
    return this.http.put<Stay>(`${this.apiUrl}/${id}`, data);
  }

  deleteStay(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  checkIn(id: number): Observable<Stay> {
    return this.http.post<Stay>(`${this.apiUrl}/${id}/check-in`, {});
  }

  checkOut(id: number): Observable<Stay> {
    return this.http.post<Stay>(`${this.apiUrl}/${id}/check-out`, {});
  }
}
