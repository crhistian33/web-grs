import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { StateWorkAction } from './state-work.actions';
import { StateWork, StateWorkRequest, StateWorkStateModel } from '@models/state.model';
import { BaseState } from '@shared/state/base.state';
import { StateworkService } from '@services/statework.service';

@State<StateWorkStateModel>({
  name: 'stateWork',
  defaults: {
    entities: [],
    filteredItems: [],
    trashedItems: [],
    filterTrashedItems: [],
    selectedEntity: null,
    searchTerm: '',
    loaded: false,
    result: null,
  }
})
@Injectable()
export class StateWorkState extends BaseState<StateWork, StateWorkRequest> {
  constructor(private stateWorkService: StateworkService) {
    super(stateWorkService);
  }

  @Selector()
  static getItems(state: StateWorkStateModel): StateWork[] {
    return state.filteredItems;
  }

  @Action(StateWorkAction.GetAll)
  getAll(ctx: StateContext<StateWorkStateModel>) {
    return this.getItems(ctx, StateWorkAction.GetAll.type);
  }
}
