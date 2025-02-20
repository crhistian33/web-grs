import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Worker, WorkerRequest } from '../models/worker.model';
import { environment } from '@environments/environment';
import { BaseCrudService } from '@shared/services/base-crud.service';
import { Observable } from 'rxjs';
import { checkToken } from 'src/app/interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root',
})
export class WorkerService extends BaseCrudService<Worker, WorkerRequest> {

  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/workers`);
  }

  getTitulars(): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${environment.API_URL}/workers/titulars`, { context: checkToken() });
  }

  getUnassigns(id?: number) {
    const url = id
    ? `${environment.API_URL}/workers/unassigns/${id}`
    : `${environment.API_URL}/workers/unassigns`;

    return this.http.get<Worker[]>(url, { context: checkToken() });
  }

  uploadWorkers(payload: any) {
    return this.http.post(`${environment.API_URL}/workers/bulk-upload`, payload, { context: checkToken() })
  }
}
