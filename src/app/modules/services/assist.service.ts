import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Assist } from '@models/assist.model';
import { BaseCrudService } from '@shared/services/base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class AssistService extends BaseCrudService<Assist> {
  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/assists`);
  }
}
