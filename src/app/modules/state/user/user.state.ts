import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { UserAction } from './user.actions';
import { User, UserStateModel } from '@models/user.model';
import { BaseState } from '@shared/state/base.state';
import { UserService } from '@services/user.service';
import { tap } from 'rxjs';

@State<UserStateModel>({
  name: 'user',
  defaults: {
    entities: [],
    filteredItems: [],
    trashedItems: [],
    selectedEntity: null,
    searchTerm: '',
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
  profile(ctx: StateContext<UserStateModel>) {
    return this.userService.profile().pipe(
      tap((response: any) => {
        ctx.patchState({ selectedEntity: response.data })
      })
    );
  }
}
