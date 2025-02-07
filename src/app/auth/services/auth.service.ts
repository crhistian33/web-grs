import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthResponse, LoginResponse } from '../models/auth.model';
import { catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private apiUrl = environment.API_URL + '/auth';

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      email, password
    }).pipe(
      catchError(((error: HttpErrorResponse) => {
        return this.handleError(error);
      }))
    )
  }

  refresh(refresh_token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refresh_token }).pipe(
      catchError(((error: HttpErrorResponse) => {
        return this.handleError(error);
      }))
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;

    switch (error.status) {
      case 401:
        errorMessage = error.error.error;
        break;
      case 404:
        errorMessage = 'Servicio no disponible';
        break;
      case 500:
        errorMessage = 'Error en el servidor';
        break;
      default:
        errorMessage = 'Error de conexión';
    }

    return of({
      success: false,
      error: errorMessage
    });
  }
}
