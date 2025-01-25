import { Injectable } from '@angular/core';
import { Assist, AssistStateModel } from '@models/assist.model';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AssistService } from '@services/assist.service';
import { BaseState } from '@shared/state/base.state';
import { AssistActions } from './assist.actions';

@State<AssistStateModel>({
  name: 'assist',
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
export class AssistState extends BaseState<Assist> {
  constructor(private assistService: AssistService) {
    super(assistService);
  }

  @Selector()
  static getItems(state: AssistStateModel): Assist[] {
    return state.filteredItems;
  }

  @Selector()
  static getSelectedItems(state: AssistStateModel) {
    return state.entities.filter((entity) => entity.selected);
  }

  @Selector()
  static areAllSelected(state: AssistStateModel) {
    return (
      state.entities.length > 0 &&
      state.entities.every((entity) => entity.selected)
    );
  }

  @Selector()
  static hasSelectedItems(state: AssistStateModel) {
    return state.entities.some((entity) => entity.selected);
  }

  @Action(AssistActions.GetAll)
  private getAll(ctx: StateContext<AssistStateModel>) {
    return this.getItems(ctx, AssistActions.GetAll.type);
  }

  @Action(AssistActions.Filters)
  private Filters(ctx: StateContext<AssistStateModel>, { payload, columns }: AssistActions.Filters<Assist>) {
    return super.filtersItems(ctx, AssistActions.Filters.type, payload, columns);
  }
}
