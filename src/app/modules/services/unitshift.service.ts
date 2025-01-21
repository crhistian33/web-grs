import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitshiftService {
  private readonly http = inject(HttpClient);

  readonly API_URL = `${environment.API_URL}/unitshifts`;

  verifiedIfAssign(id: number, assign_id?: number): Observable<boolean> {
    if(assign_id)
      return this.http.get<boolean>(`${this.API_URL}/verified/${id}/${assign_id}`);
    else
      return this.http.get<boolean>(`${this.API_URL}/verified/${id}`);
  }
}
