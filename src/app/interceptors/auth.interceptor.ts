import { HttpContext, HttpContextToken, HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthAction } from '../auth/state/auth.actions';
import { TokenService } from '../auth/services/token.service';

const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

class InterceptorHelper {
  private store = inject(Store);
  private tokenService = inject(TokenService);

  addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  handleNewToken(request: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenSubject.next(null);

      const refreshToken = this.tokenService.getRefreshToken();
      const isValidRefreshToken = this.tokenService.isValidRefreshToken();

      if (refreshToken && isValidRefreshToken) {
        return this.store.dispatch(new AuthAction.Refresh()).pipe(
          switchMap(() => {
            isRefreshing = false;
            const newToken = this.tokenService.getToken();

            if (newToken) {
              refreshTokenSubject.next(newToken);
              return next(this.addToken(request, newToken));
            } else {
              this.store.dispatch(new AuthAction.Logout());
              return throwError(() => new Error('Error al actualizar el token'));
            }
          }),
          catchError((error) => {
            isRefreshing = false;
            this.store.dispatch(new AuthAction.Logout());
            return throwError(() => error);
          })
        );
      }
    }

    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next(this.addToken(request, token || '')))
    );
  }

  handleUnauthorized(request: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
    return this.handleNewToken(request, next).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  isLoginRequest(req: HttpRequest<any>): boolean {
    return req.url.includes('/auth/login');
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const helper = new InterceptorHelper();
  const tokenService = inject(TokenService);

  if (req.context.get(CHECK_TOKEN)) {
    const token = tokenService.getToken();
    const isValidToken = tokenService.isValidToken();

    if (token) {
      if (isValidToken) {
        req = helper.addToken(req, token);
      } else {
        return helper.handleNewToken(req, next);
      }
    }
  }

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        if (helper.isLoginRequest(req)) {
          return throwError(() => error);
        }
        return helper.handleUnauthorized(req, next);
      }
      return throwError(() => error);
    })
  );
};
