import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Worker } from '../models/worker.model';
import { environment } from '@environments/environment';
import { BaseCrudService } from '@shared/services/base-crud.service';
import { Observable } from 'rxjs';
import { checkToken } from 'src/app/interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root',
})
export class WorkerService extends BaseCrudService<Worker> {

  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/workers`);
  }

  getUnassignments(): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${environment.API_URL}/workers/unassigneds`, { context: checkToken() });
  }

  // getReassignments(): Observable<Worker[]> {
  //   return this.http.get<Worker[]>(`${environment.API_URL}/workers/reassigns`);
  // }

  getTitulars(): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${environment.API_URL}/workers/titulars`, { context: checkToken() });
  }

  getAssignsId(id: number): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${environment.API_URL}/workers/assigns/${id}`, { context: checkToken() });
  }

  uploadWorkers(payload: any) {
    return this.http.post(`${environment.API_URL}/workers/bulk-upload`, payload, { context: checkToken() })
  }
}
