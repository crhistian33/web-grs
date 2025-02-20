import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { UnitShift, UnitShiftRequest } from '@models/unitshift.model';
import { BaseCrudService } from '@shared/services/base-crud.service';
import { Observable } from 'rxjs';
import { checkToken } from 'src/app/interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root'
})
export class UnitshiftService extends BaseCrudService<UnitShift, UnitShiftRequest> {
  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/unitshifts`);
  }

  verifiedIfAssign(id: number, assign_id?: number): Observable<boolean> {
    if(assign_id)
      return this.http.get<boolean>(`${environment.API_URL}/unitshifts/verified/${id}/${assign_id}`, { context: checkToken() });
    else
      return this.http.get<boolean>(`${environment.API_URL}/unitshifts/verified/${id}`, { context: checkToken() });
  }

  getWithAssigns(): Observable<UnitShift[]> {
    return this.http.get<UnitShift[]>(`${environment.API_URL}/unitshifts/getwithassigns`, { context: checkToken() });
  }
}
