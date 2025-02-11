import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '@models/user.model';
import { BaseCrudService } from '@shared/services/base-crud.service';
import { map, Observable } from 'rxjs';
import { checkToken } from 'src/app/interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseCrudService<User> {
  constructor(private http: HttpClient) {
    super(http, `${environment.API_URL}/users`);
  }
}
