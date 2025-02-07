import { HttpContext, HttpContextToken, HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthAction } from '../auth/state/auth.actions';
import { TokenService } from '../auth/services/token.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);
const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const tokenService = inject(TokenService);

  if(req.context.get(CHECK_TOKEN)) {
    const token = tokenService.getToken();
    const isValidToken = tokenService.isValidToken();

    if(token) {
      if (isValidToken) {
        req = addToken(req, token);
      } else {
        return handleNewToken(req, next, store);
      }
    }
  }

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handleUnauthorized(req, next, store);
      }
      return throwError(() => error);
    })
  );
};

const addToken = (request: HttpRequest<any>, token: string) => {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
};

const handleNewToken = (request: HttpRequest<any>, next: HttpHandlerFn, store: Store) => {
  const tokenService = inject(TokenService);

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);
    const refreshToken = tokenService.getRefreshToken();
    const isValidRefreshToken = tokenService.isValidRefreshToken();

    if(refreshToken && isValidRefreshToken) {
      return store.dispatch(new AuthAction.Refresh()).pipe(
        switchMap(() => {
          isRefreshing = false;
          const newToken = tokenService.getToken();
          if(newToken) {
            refreshTokenSubject.next(newToken);
            return next(addToken(request, newToken));
          } else {
            store.dispatch(new AuthAction.Logout());
            return throwError(() => new Error('Error al actualizar el token'));
          }
        }),
        catchError((error) => {
          isRefreshing = false;
          store.dispatch(new AuthAction.Logout());
          return throwError(() => error);
        })
      );
    }
  }

  return refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap(token => next(addToken(request, token || '')))
  );
}

const handleUnauthorized = (request: HttpRequest<any>, next: HttpHandlerFn, store: Store) => {
  return handleNewToken(request, next, store);
}
