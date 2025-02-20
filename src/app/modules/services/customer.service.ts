import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Customer, CustomerRequest } from '@models/customer.model';
import { BaseCrudService } from '@shared/services/base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseCrudService<Customer, CustomerRequest> {
  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/customers`);
  }
}
