import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface INotification {
  message: string[];
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<INotification>();
  notification$ = this.notificationSubject.asObservable();

  show(message: string[], type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000) {
    this.notificationSubject.next({ message, type, duration });
  }
}
