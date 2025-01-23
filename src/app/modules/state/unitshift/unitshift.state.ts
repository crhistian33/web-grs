import { Injectable } from '@angular/core';
import { UnitShift, UnitshiftStateModel } from '@models/unitshift.model';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { UnitShiftActions } from './unitshift.actions';
import { BaseState } from '@shared/state/base.state';
import { UnitshiftService } from '@services/unitshift.service';

@State<UnitshiftStateModel>({
  name: 'unitshift',
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
export class UnitshiftState extends BaseState<UnitShift> {
  constructor(private unitshiftService: UnitshiftService) {
    super(unitshiftService);
  }

  @Selector()
  static getState(state: UnitshiftStateModel) {
    return state;
  }

  @Selector()
  static getItems(state: UnitshiftStateModel) {
    return state.filteredItems;
  }

  @Selector()
  static getAssigns(state: UnitshiftStateModel) {
    return state.filteredItems.filter(item => item.assignments.some(assign => assign.state));
  }

  @Action(UnitShiftActions.GetAll)
  getAll(ctx: StateContext<UnitshiftStateModel>) {
    return this.getItems(ctx, UnitShiftActions.GetAll.type)
  }
}
