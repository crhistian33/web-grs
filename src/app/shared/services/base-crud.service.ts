import { Inject, Injectable } from '@angular/core';
import { BaseModel } from '../models/base.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { checkToken } from 'src/app/interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root',
})
export class BaseCrudService<T extends BaseModel> {
  constructor(private httpClient: HttpClient, @Inject(String) protected apiUrl: string) {}

  getAll(): Observable<T[]> {
    return this.httpClient.get<T[]>(this.apiUrl, { context: checkToken() }).pipe(catchError(this.handleError));
  }

  getDeletes(): Observable<T[]> {
    return this.httpClient.get<T[]>(`${this.apiUrl}/deletes`, { context: checkToken() }).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<T> {
    return this.httpClient.get<T>(`${this.apiUrl}/${id}`, { context: checkToken() })
      .pipe(catchError(this.handleError));
  }

  create(resource: T): Observable<T> {
    return this.httpClient.post<T>(this.apiUrl, resource, { context: checkToken() })
      .pipe(catchError(this.handleError));
  }

  update(id: number, resource: Partial<T>): Observable<T> {
    return this.httpClient.patch<T>(`${this.apiUrl}/${id}`, resource, { context: checkToken() })
      .pipe(catchError(this.handleError));
  }

  delete(id: number, del: boolean): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}?delete=${del}`, { context: checkToken() })
      .pipe(catchError(this.handleError));
  }

  restore(id: number): Observable<void> {
    return this.httpClient.get<void>(`${this.apiUrl}/restore/${id}`, { context: checkToken() })
      .pipe(catchError(this.handleError));
  }

  deleteAll(resource: T[], del: boolean, active: boolean): Observable<T[]> {
    return this.httpClient.post<T[]>(`${this.apiUrl}/destroyes`, { resources: resource, del, active }, { context: checkToken() })
      .pipe(catchError(this.handleError));
  }

  restoreAll(resource: T[]): Observable<T[]> {
    return this.httpClient.post<T[]>(`${this.apiUrl}/restores`, { resources: resource }, { context: checkToken() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status !== 500) {
      return throwError(() => error);
    }
    return throwError(() => new Error('Error del servidor. Inténtelo más tarde'));
    //return throwError(() => error);
  }
}
