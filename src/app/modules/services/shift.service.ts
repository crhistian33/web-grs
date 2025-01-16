import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Shift } from '@models/shift.model';
import { BaseCrudService } from '@shared/services/base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftService extends BaseCrudService<Shift> {
  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/shifts`);
  }
}
