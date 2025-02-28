import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Center, CenterRequest } from '@models/center.model';
import { BaseCrudService } from '@shared/services/base-crud.service';

@Injectable({
  providedIn: 'root',
})
export class CenterService extends BaseCrudService<Center, CenterRequest> {
  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/centers`);
  }
}
