import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { StateWork, StateWorkRequest } from '@models/state.model';
import { BaseCrudService } from '@shared/services/base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class StateworkService extends BaseCrudService<StateWork, StateWorkRequest> {
  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/states`);
  }
}
