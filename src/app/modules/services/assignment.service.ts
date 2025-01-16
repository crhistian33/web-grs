import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Assignment } from '@models/assignment.model';
import { BaseCrudService } from '@shared/services/base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService extends BaseCrudService<Assignment> {
  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/assignments`);
  }
}
