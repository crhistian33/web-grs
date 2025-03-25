import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { WorkerAssignment, WorkerAssignmentRequest } from '@models/workerassignment.model';
import { BaseCrudService } from '@shared/services/base-crud.service';
import { checkToken } from 'src/app/interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root'
})
export class WorkerassignmentService extends BaseCrudService<WorkerAssignment, WorkerAssignmentRequest> {

  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/worker_assignments`);
  }

  getWorkerToUnit(unit_shift_id: number, today: string) {
    let params = new HttpParams();

    params = params.set('unit_shift_id', unit_shift_id);
    params = params.set('today', today);

    return this.http.get<Worker[]>(`${environment.API_URL}/worker_assignments/workersassigns`, { params, context: checkToken() });
  }
}
