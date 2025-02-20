import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Assignment, AssignmentRequest } from '@models/assignment.model';
import { BaseCrudService } from '@shared/services/base-crud.service';
import { Observable } from 'rxjs';
import { checkToken } from 'src/app/interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService extends BaseCrudService<Assignment, AssignmentRequest> {
  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/assignments`);
  }

  verfiiedAssign(id: number) {
    return this.http.get(`${environment.API_URL}/assignments/verified/${id}`, { context: checkToken() });
  }

  getReassignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${environment.API_URL}/assignments/reassignments`, { context: checkToken() });
  }
}
