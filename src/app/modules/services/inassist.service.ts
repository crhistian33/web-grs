import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Inassist, InassistDays, InassistRequest } from '@models/inassist.model';
import { BaseCrudService } from '@shared/services/base-crud.service';
import { checkToken } from 'src/app/interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root'
})
export class InassistService extends BaseCrudService<Inassist, InassistRequest> {
  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/inassists`);
  }

  getDaysUnitMonth(unit_shift_id: number, month: number) {
    let params = new HttpParams;
    params = params.set('unit_shift_id', unit_shift_id);
    params = params.set('month', month);

    return this.http.get<InassistDays[]>(`${environment.API_URL}/inassists/daysmonth`, { params, context: checkToken() });
  }

  deleteInassists(worker_id: number, month: number) {
    const params = new HttpParams()
      .set('worker_id', worker_id)
      .set('month', month);

    return this.http.delete(`${environment.API_URL}/inassists/destroy`, { params, context: checkToken() });
  }

  deleteManyInassists(resources: InassistRequest[]) {
    return this.http.delete(`${environment.API_URL}/inassists/destroymany`, { body: resources, context: checkToken() });
  }
}
