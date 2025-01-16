import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { TypeWorker } from '@models/type-worker.model';
import { BaseCrudService } from '@shared/services/base-crud.service';

@Injectable({
  providedIn: 'root',
})
export class TypeWorkerService extends BaseCrudService<TypeWorker> {
  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/type_workers`);
  }
}
