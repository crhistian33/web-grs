import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { WorkerAssignment, WorkerAssignmentRequest } from '@models/workerassignment.model';
import { BaseCrudService } from '@shared/services/base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class WorkerassignmentService extends BaseCrudService<WorkerAssignment, WorkerAssignmentRequest> {

  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/worker_assignments`);
  }
}
