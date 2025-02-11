import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Base2Action } from './base2.actions';

export interface Base2StateModel {
  items: string[];
}

@State<Base2StateModel>({
  name: 'base2',
  defaults: {
    items: []
  }
})
@Injectable()
export class Base2State {

  @Selector()
  static getState(state: Base2StateModel) {
    return state;
  }

  @Action(Base2Action)
  add(ctx: StateContext<Base2StateModel>, { payload }: Base2Action) {
    const stateModel = ctx.getState();
    stateModel.items = [...stateModel.items, payload];
    ctx.setState(stateModel);
  }
}
