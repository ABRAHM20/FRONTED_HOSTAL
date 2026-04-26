import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, PaymentCreate, PaymentUpdate } from '../models/payment.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getPayments(skip: number = 0, limit: number = 20, status?: string): Observable<Payment[]> {
    let url = `${this.apiUrl}?skip=${skip}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<Payment[]>(url);
  }

  getPayment(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  createPayment(data: PaymentCreate): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}`, data);
  }

  updatePayment(id: number, data: PaymentUpdate): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${id}`, data);
  }

  deletePayment(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getStayPayments(stayId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/stay/${stayId}`);
  }

  getStayTotalPaid(stayId: number): Observable<{ stay_id: number; total_paid: number }> {
    return this.http.get<{ stay_id: number; total_paid: number }>(
      `${this.apiUrl}/stay/${stayId}/total-paid`
    );
  }
}
