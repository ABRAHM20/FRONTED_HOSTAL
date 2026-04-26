import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Room,
  RoomPlan,
  RoomRate,
  RoomType,
  RoomCreate,
  RoomPlanCreate,
  RoomRateCreate,
  RoomTypeCreate
} from '../models/room.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = `${environment.apiUrl}/rooms`;

  constructor(private http: HttpClient) {}

  // ========== ROOM TYPES ==========

  getRoomTypes(skip: number = 0, limit: number = 20): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(`${this.apiUrl}/types?skip=${skip}&limit=${limit}`);
  }

  getRoomType(id: number): Observable<RoomType> {
    return this.http.get<RoomType>(`${this.apiUrl}/types/${id}`);
  }

  createRoomType(data: RoomTypeCreate): Observable<RoomType> {
    return this.http.post<RoomType>(`${this.apiUrl}/types`, data);
  }

  updateRoomType(id: number, data: Partial<RoomTypeCreate>): Observable<RoomType> {
    return this.http.put<RoomType>(`${this.apiUrl}/types/${id}`, data);
  }

  deleteRoomType(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/types/${id}`);
  }

  // ========== ROOM PLANS ==========

  getRoomPlans(skip: number = 0, limit: number = 20): Observable<RoomPlan[]> {
    return this.http.get<RoomPlan[]>(`${this.apiUrl}/plans?skip=${skip}&limit=${limit}`);
  }

  getRoomPlan(id: number): Observable<RoomPlan> {
    return this.http.get<RoomPlan>(`${this.apiUrl}/plans/${id}`);
  }

  createRoomPlan(data: RoomPlanCreate): Observable<RoomPlan> {
    return this.http.post<RoomPlan>(`${this.apiUrl}/plans`, data);
  }

  updateRoomPlan(id: number, data: Partial<RoomPlanCreate>): Observable<RoomPlan> {
    return this.http.put<RoomPlan>(`${this.apiUrl}/plans/${id}`, data);
  }

  deleteRoomPlan(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/plans/${id}`);
  }

  // ========== ROOM RATES ==========

  getRoomRates(skip: number = 0, limit: number = 20): Observable<RoomRate[]> {
    return this.http.get<RoomRate[]>(`${this.apiUrl}/rates?skip=${skip}&limit=${limit}`);
  }

  getRoomRate(id: number): Observable<RoomRate> {
    return this.http.get<RoomRate>(`${this.apiUrl}/rates/${id}`);
  }

  createRoomRate(data: RoomRateCreate): Observable<RoomRate> {
    return this.http.post<RoomRate>(`${this.apiUrl}/rates`, data);
  }

  updateRoomRate(id: number, data: Partial<RoomRateCreate>): Observable<RoomRate> {
    return this.http.put<RoomRate>(`${this.apiUrl}/rates/${id}`, data);
  }

  deleteRoomRate(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/rates/${id}`);
  }

  // ========== ROOMS ==========

  getRooms(skip: number = 0, limit: number = 20, status?: string): Observable<Room[]> {
    let url = `${this.apiUrl}?skip=${skip}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<Room[]>(url);
  }

  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  createRoom(data: RoomCreate): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}`, data);
  }

  updateRoom(id: number, data: Partial<RoomCreate>): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, data);
  }

  deleteRoom(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  changeRoomStatus(id: number, status: string): Observable<Room> {
    return this.http.patch<Room>(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }
}
