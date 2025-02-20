import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AuthAction } from './auth.actions';
import { AuthService } from '../services/auth.service';
import { switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { SetLoading } from '@shared/state/loading/loading.actions';
import { UserAction } from '@state/user/user.actions';
import { CompanyActions } from '@state/company/company.actions';
import { InitialLoaderService } from '@shared/services/initial-loader.service';
import { CenterActions } from '@state/center/center.action';
import { CustomerActions } from '@state/customer/customer.action';
import { UnitActions } from '@state/unit/unit.actions';
import { ShiftActions } from '@state/shift/shift.action';
import { TypeWorkerActions } from '@state/typeworker/typeworker.action';
import { WorkerActions } from '@state/worker/worker.action';
import { User } from '@models/user.model';

export interface AuthStateModel {
  access_token: string | null;
  refresh_token: string | null;
  error: string | null;
  isAuthenticated: boolean;
}

const initialValue = {
  access_token: null,
  refresh_token: null,
  error: null,
  isAuthenticated: false,
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: initialValue
})

@Injectable()
export class AuthState {
  private readonly service = inject(AuthService);
  private readonly router = inject(Router);
  private readonly initialLoaderService = inject(InitialLoaderService);

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
            if(response.data && response.success) {
              ctx.patchState({
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                isAuthenticated: true,
                error: null,
              });
              ctx.dispatch(new UserAction.GetProfile(response.data.user)).pipe(
                switchMap(() => this.initialLoaderService.load())
              )
              .subscribe();
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
    ctx.dispatch(new SetLoading(AuthAction.Logout.type, true));
    return this.service.logout().pipe(
      tap(() => {
        localStorage.removeItem('auth.access_token');
        localStorage.removeItem('auth.isAuthenticated');
        localStorage.removeItem('auth.refresh_token');
        localStorage.removeItem('user');
        ctx.setState(initialValue);
        ctx.dispatch([
          new CenterActions.clearAll,
          new CompanyActions.clearAll,
          new CustomerActions.clearAll,
          new UnitActions.clearAll,
          new ShiftActions.clearAll,
          new TypeWorkerActions.clearAll,
          new WorkerActions.clearAll,
          new UserAction.ClearAll,
        ]);
        ctx.dispatch(new SetLoading(AuthAction.Logout.type, false));
        this.router.navigate(['/auth/login']);
      })
    );
  }
}
