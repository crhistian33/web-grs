import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Unit } from '@models/unit.model';
import { BaseCrudService } from '@shared/services/base-crud.service';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitService extends BaseCrudService<Unit> {
  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/units`);
  }

  GetAllToShift(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/units/unitshifts`)
  }
}
