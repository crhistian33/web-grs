import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Worker } from '../models/worker.model';
import { environment } from '@environments/environment';
import { BaseCrudService } from '@shared/services/base-crud.service';

@Injectable({
  providedIn: 'root',
})
export class WorkerService extends BaseCrudService<Worker> {
  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/workers`);
  }
}
