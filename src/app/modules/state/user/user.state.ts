import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { UserAction } from './user.actions';
import { User, UserStateModel } from '@models/user.model';
import { BaseState } from '@shared/state/base.state';
import { UserService } from '@services/user.service';
import { tap } from 'rxjs';
import { CountActions } from '@state/count/count.actions';

@State<UserStateModel>({
  name: 'user',
  defaults: {
    entities: [],
    filteredItems: [],
    trashedItems: [],
    selectedEntity: null,
    searchTerm: '',
    loaded: false,
    result: null,
  }
})
@Injectable()
export class UserState extends BaseState<User> {
  constructor(private userService: UserService) {
    super(userService);
  }

  @Selector()
  static getItem(state: UserStateModel) {
    return state.selectedEntity;
  }

  @Action(UserAction.GetProfile)
  profile(ctx: StateContext<UserStateModel>, { payload }: UserAction.GetProfile) {
    const state = ctx.getState();
    if(state.selectedEntity)
      return;

    ctx.patchState({
      selectedEntity: payload
    });
  }

  @Action(UserAction.ClearAll)
  clearAll (ctx: StateContext<UserStateModel>) {
    return this.clearAllItems(ctx);
  }
}
