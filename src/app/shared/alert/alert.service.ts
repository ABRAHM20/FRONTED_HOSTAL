import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface AlertMessage {
  id: string;
  type: AlertType;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly alerts$ = new BehaviorSubject<AlertMessage[]>([]);

  get alerts() {
    return this.alerts$.asObservable();
  }

  success(text: string, timeoutMs: number = 3000): void {
    this.push('success', text, timeoutMs);
  }

  error(text: string, timeoutMs: number = 5000): void {
    this.push('error', text, timeoutMs);
  }

  info(text: string, timeoutMs: number = 3000): void {
    this.push('info', text, timeoutMs);
  }

  warning(text: string, timeoutMs: number = 4000): void {
    this.push('warning', text, timeoutMs);
  }

  remove(id: string): void {
    this.alerts$.next(this.alerts$.value.filter((alert) => alert.id !== id));
  }

  private push(type: AlertType, text: string, timeoutMs: number): void {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const next = [...this.alerts$.value, { id, type, text }];
    this.alerts$.next(next);

    if (timeoutMs > 0) {
      setTimeout(() => this.remove(id), timeoutMs);
    }
  }
}
