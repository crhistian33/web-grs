import { inject, Inject, Injectable } from '@angular/core';
import { BaseModel } from '../models/base.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { checkToken } from 'src/app/interceptors/auth.interceptor';
import { Store } from '@ngxs/store';
import { UserState } from '@state/user/user.state';

@Injectable({
  providedIn: 'root',
})
export class BaseCrudService<T extends BaseModel, Trequest> {
  private readonly store = inject(Store);

  constructor(
    private httpClient: HttpClient,
    @Inject(String) protected apiUrl: string
  ) {}

  getItems(): Observable<T[]> {
    return this.httpClient.get<T[]>(this.apiUrl, { context: checkToken() }).pipe(catchError(this.handleError));
  }

  getAll(id?: number): Observable<T[]> {
    const url = id
      ? `${this.apiUrl}/all/${id}`
      : `${this.apiUrl}/all`;

    return this.httpClient.get<T[]>(url, { context: checkToken() }).pipe(catchError(this.handleError));
  }

  getTrashed(id?: number) {
    const url = id
    ? `${this.apiUrl}/deletes/${id}`
    : `${this.apiUrl}/deletes`;

    return this.httpClient.get<T[]>(url, { context: checkToken() });
  }

  getById(id: number): Observable<T> {
    return this.httpClient.get<T>(`${this.apiUrl}/${id}`, { context: checkToken() })
      .pipe(catchError(this.handleError));
  }

  create(resource: Trequest): Observable<T> {
    const userID = this.store.selectSnapshot(UserState.getCurrentUserID);
    const newResources = {
      ...resource,
      created_by: userID
    };
    return this.httpClient.post<T>(this.apiUrl, newResources, { context: checkToken() })
      .pipe(catchError(this.handleError));
  }

  update(id: number, resource: Partial<Trequest>): Observable<T> {
    const userID = this.store.selectSnapshot(UserState.getCurrentUserID);
    const newResources = {
      ...resource,
      updated_by: userID
    };
    return this.httpClient.patch<T>(`${this.apiUrl}/${id}`, newResources, { context: checkToken() })
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

  deleteAll(resource: T[], del: boolean, active: boolean, companyId?: number): Observable<T[]> {
    const url = companyId
      ? `${this.apiUrl}/destroyes/${companyId}`
      : `${this.apiUrl}/destroyes`;

    console.log('URL', url);
    return this.httpClient.post<T[]>(url, { resources: resource, del, active }, { context: checkToken() })
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
    //return throwError(() => new Error('Error del servidor. Inténtelo más tarde'));
    return throwError(() => error);
  }
}
