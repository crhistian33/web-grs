import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { FilterStateModel } from '@shared/models/filter.model';
import { FilterActions } from './filter.actions';

@State<FilterStateModel>({
  name: 'filters',
  defaults: {}
})

@Injectable()
export class FilterState {
  @Selector()
  static getItems(state: FilterStateModel): FilterStateModel {
    return state;
  }
  @Selector()
  static getSelectedCompanyId(state: FilterStateModel): number | null {
    return state.companyId ?? null;
  }
  @Selector()
  static getSelectedCustomerId(state: FilterStateModel): number | null {
    return state.customerId ?? null;
  }
  @Selector()
  static getSelectedUnitId(state: FilterStateModel): number | null {
    return state.unitId ?? null;
  }
  @Selector()
  static getSelectedShiftId(state: FilterStateModel): number | null {
    return state.shiftId ?? null;
  }

  @Action(FilterActions.SelectCompany)
  selectCompany(ctx: StateContext<FilterStateModel>, action: FilterActions.SelectCompany) {
    ctx.patchState({
      companyId: action.companyId,
      customerId: null,
      unitId: null,
      shiftId: null,
    });
  }

  @Action(FilterActions.SelectCustomer)
  selectCustomer(ctx: StateContext<FilterStateModel>, action: FilterActions.SelectCustomer) {
    ctx.patchState({
      customerId: action.customerId,
      unitId: null,
      shiftId: null,
    });
  }

  @Action(FilterActions.SelectUnit)
  selectUnit(ctx: StateContext<FilterStateModel>, action: FilterActions.SelectUnit) {
    ctx.patchState({
      unitId: action.unitId,
      shiftId: null,
    });
  }

  @Action(FilterActions.SelectShift)
  selectShift(ctx: StateContext<FilterStateModel>, action: FilterActions.SelectShift) {
    ctx.patchState({
      shiftId: action.shiftId,
    });
  }

  @Action(FilterActions.updateFilters)
  updateFilter(ctx: StateContext<FilterStateModel>, { payload }: FilterActions.updateFilters) {
    ctx.patchState(payload);
  }
}
