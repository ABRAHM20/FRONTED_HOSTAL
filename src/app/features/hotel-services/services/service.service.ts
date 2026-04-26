import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelService, StayService, HotelServiceCreate, StayServiceCreate } from '../models/service.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelServiceService {
  private apiUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  // ========== HOTEL SERVICES ==========

  getServices(skip: number = 0, limit: number = 20, activeOnly: boolean = true): Observable<HotelService[]> {
    return this.http.get<HotelService[]>(
      `${this.apiUrl}?skip=${skip}&limit=${limit}&active_only=${activeOnly}`
    );
  }

  getService(id: number): Observable<HotelService> {
    return this.http.get<HotelService>(`${this.apiUrl}/${id}`);
  }

  createService(data: HotelServiceCreate): Observable<HotelService> {
    return this.http.post<HotelService>(`${this.apiUrl}`, data);
  }

  updateService(id: number, data: Partial<HotelServiceCreate>): Observable<HotelService> {
    return this.http.put<HotelService>(`${this.apiUrl}/${id}`, data);
  }

  deleteService(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  // ========== STAY SERVICES ==========

  getStayServices(stayId: number): Observable<StayService[]> {
    return this.http.get<StayService[]>(`${this.apiUrl}/stay/${stayId}`);
  }

  addServiceToStay(data: StayServiceCreate): Observable<StayService> {
    return this.http.post<StayService>(`${this.apiUrl}/stay`, data);
  }

  getStayService(id: number): Observable<StayService> {
    return this.http.get<StayService>(`${this.apiUrl}/stay-service/${id}`);
  }

  updateStayService(id: number, data: Partial<StayServiceCreate>): Observable<StayService> {
    return this.http.put<StayService>(`${this.apiUrl}/stay-service/${id}`, data);
  }

  deleteStayService(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/stay-service/${id}`);
  }
}
