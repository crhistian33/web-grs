import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AuthAction } from './auth.actions';
import { AuthService } from '../services/auth.service';
import { take, tap } from 'rxjs';
import { Router } from '@angular/router';
import { SetLoading } from '@shared/state/loading/loading.actions';

export interface AuthStateModel {
  access_token: string | null;
  refresh_token: string | null;
  error: string | null;
  isAuthenticated: boolean;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    access_token: null,
    refresh_token: null,
    error: null,
    isAuthenticated: false,
  }
})

@Injectable()
export class AuthState {
  private readonly service = inject(AuthService);
  private readonly router = inject(Router);

  @Selector()
  static getError(state: AuthStateModel) {
    return state.error;
  }

  @Selector()
  static getToken(state: AuthStateModel) {
    return state.access_token;
  }

  @Selector()
  static getRefreshToken(state: AuthStateModel) {
    return state.refresh_token;
  }

  @Selector()
  static getAuthenticated(state: AuthStateModel) {
    return state.isAuthenticated;
  }

  @Action(AuthAction.Login)
  login(ctx: StateContext<AuthStateModel>, payload: AuthAction.Login) {
    ctx.dispatch(new SetLoading(AuthAction.Login.type, true));
    ctx.patchState({ error: null });
    const { email, password } = payload;
    return this.service.login(email, password)
      .pipe(
        tap({
          next: (response) => {
            if(response.success) {
              ctx.patchState({
                access_token: response.data?.access_token,
                refresh_token: response.data?.refresh_token,
                isAuthenticated: true,
                error: null
              });
              this.router.navigate(['/inicio']);
              ctx.dispatch(new SetLoading(AuthAction.Login.type, false));
            } else {
              ctx.dispatch(new SetLoading(AuthAction.Login.type, false));
              ctx.patchState({ error: response.error })
            }
          },
        })
      )
  }

  @Action(AuthAction.Refresh)
  refresh(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({ error: null });
    const refresh_token = ctx.getState().refresh_token;

    if(!refresh_token)
      return;

    return this.service.refresh(refresh_token)
      .pipe(
        tap(
          (response) => {
            if(response.success) {
              ctx.patchState({
                access_token: response.data?.access_token,
                refresh_token: response.data?.refresh_token,
                error: null
              });
            } else {
              ctx.patchState({ error: response.error })
            }
          }
        )
      )
  }

  @Action(AuthAction.Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.setState({
      access_token: null,
      refresh_token: null,
      isAuthenticated: false,
      error: null
    });
    this.router.navigate(['/auth/login']);
  }
}
