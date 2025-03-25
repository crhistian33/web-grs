import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Assist, AssistForm, AssistRequest } from '@models/assist.model';
import { BaseCrudService } from '@shared/services/base-crud.service';
import { checkToken } from 'src/app/interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AssistService extends BaseCrudService<Assist, AssistRequest> {

  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/assists`);
  }

  getWorkersAssist(payload: AssistForm) {
    const params = this.getParams(payload);

    return this.http.get<Worker[]>(`${environment.API_URL}/assists/workersassist`, { params, context: checkToken() });
  }

  getWorkersAssistBreaks(payload: AssistForm) {
    const params = this.getParams(payload);

    return this.http.get<Worker[]>(`${environment.API_URL}/assists/workersassistbreaks`, { params, context: checkToken() });
  }

  private getParams(payload: AssistForm) {
    let params = new HttpParams();

    params = params.set('date_from', payload.date_from);
    params = params.set('date_to', payload.date_to);

    if(payload.company_id)
      params = params.set('company_id', payload.company_id);

    return params;
  }
}
