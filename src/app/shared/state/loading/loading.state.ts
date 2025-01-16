import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetLoading } from './loading.actions';
import { LoadingStateModel } from '@shared/models/loading.model';

@State<LoadingStateModel>({
  name: 'loading',
  defaults: {
    loadingActions: {}
  }
})

@Injectable()
export class LoadingState {

  @Selector()
  static isLoading(state: LoadingStateModel) {
    return (actionType: string) => state.loadingActions[actionType] || false;
  }

  @Selector()
  static anyLoading(state: LoadingStateModel) {
    return Object.values(state.loadingActions).some(loading => loading);
  }

  @Action(SetLoading)
  setLoading(ctx: StateContext<LoadingStateModel>, { actionType, isLoading }: SetLoading) {
    const state = ctx.getState();
    ctx.setState({
      loadingActions: {
        ...state.loadingActions,
        [actionType]: isLoading
      }
    });
  }
}
