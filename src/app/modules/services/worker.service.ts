import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Worker, WorkerForm, WorkerRequest } from '../models/worker.model';
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

  getUnassigns(payload?: WorkerForm) {
    console.log('Payload', payload);
    let params = new HttpParams();

    if (payload?.assignment_id) {
      params = params.set('assignment_id', payload.assignment_id);
    }

    if (payload?.company_id) {
      params = params.set('company_id', payload.company_id);
    }

    console.log('Params', params);

    return this.http.get<Worker[]>(`${environment.API_URL}/workers/unassigns`, { params, context: checkToken() });
  }

  uploadWorkers(payload: any) {
    return this.http.post(`${environment.API_URL}/workers/bulk-upload`, payload, { context: checkToken() })
  }
}
