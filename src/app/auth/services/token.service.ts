import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Store } from '@ngxs/store';
import { AuthState } from '../state/auth.state';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly store = inject(Store);

  private issuer = {
    login: environment.API_URL + '/auth/login',
    register: environment.API_URL + '/auth/register',
    refresh: environment.API_URL + '/auth/refresh',
  };

  getToken() {
    return this.store.selectSnapshot(AuthState.getToken);
  }

  getRefreshToken() {
    return this.store.selectSnapshot(AuthState.getRefreshToken);
  }

  isValidToken() {
    const token = this.getToken();
    if (token) {
      const decodeToken = jwtDecode<JwtPayload>(token);
      if(decodeToken && decodeToken?.exp) {
        const tokenDate = new Date(0);
        tokenDate.setUTCSeconds(decodeToken.exp);
        const today = new Date();
        if(decodeToken.iss)
          return tokenDate.getTime() > today.getTime() && Object.values(this.issuer).indexOf(decodeToken.iss) > -1;
        else
          return tokenDate.getTime() > today.getTime();
      }
    }
    return false;
  }

  isValidRefreshToken() {
    const token = this.getRefreshToken();
    if (token) {
      const decodeToken = jwtDecode<JwtPayload>(token);

      if(decodeToken && decodeToken?.exp) {
        const tokenDate = new Date(0);
        tokenDate.setUTCSeconds(decodeToken.exp);
        const today = new Date();
        if(decodeToken.iss)
          return tokenDate.getTime() > today.getTime() && Object.values(this.issuer).indexOf(decodeToken.iss) > -1;
        else
          return tokenDate.getTime() > today.getTime();
      }
    }
    return false;
  }
}
