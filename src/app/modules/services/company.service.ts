import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { BaseCrudService } from '@shared/services/base-crud.service';
import { Company } from '@models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService extends BaseCrudService<Company> {
  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/companies`);
  }
}
