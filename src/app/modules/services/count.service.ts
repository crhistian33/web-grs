import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Count } from '@models/counts.model';
import { catchError, Observable, throwError } from 'rxjs';
import { checkToken } from '../../interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root'
})
export class CountService {
  private apiUrl = `${environment.API_URL}/counts`;

  constructor(private http: HttpClient) {}

  getCounts(): Observable<Count> {
      return this.http.get<Count>(this.apiUrl, { context: checkToken() }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status !== 500) {
      return throwError(() => error);
    }
    return throwError(() => new Error('Error del servidor. Inténtelo más tarde'));
    //return throwError(() => error);
  }
}
