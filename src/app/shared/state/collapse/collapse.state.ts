import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { CollapseAction } from './collapse.actions';

export interface CollapseStateModel {
  navUser: boolean,
  filter: boolean
}

@State<CollapseStateModel>({
  name: 'collapse',
  defaults: {
    navUser: false,
    filter: false
  }
})
@Injectable()
export class CollapseState {

  @Selector()
  static getNavUser(state: CollapseStateModel) {
    return state.navUser;
  }

  @Selector()
  static getFilter(state: CollapseStateModel) {
    return state.filter;
  }

  @Action(CollapseAction.toggleNavUser)
  toggleNavUser(ctx: StateContext<CollapseStateModel>) {
    const state = ctx.getState();
    ctx.patchState({ navUser: !state.navUser });
  }

  @Action(CollapseAction.closeNavUser)
  closeNavBar(ctx: StateContext<CollapseStateModel>) {
    ctx.patchState({ navUser:false });
  }

  @Action(CollapseAction.toggleFilter)
  toggleFilter(ctx: StateContext<CollapseStateModel>) {
    const state = ctx.getState();
    ctx.patchState({ filter: !state.filter });
  }

  @Action(CollapseAction.closeFilter)
  closeFilter(ctx: StateContext<CollapseStateModel>) {
    ctx.patchState({ filter:false });
  }
}
