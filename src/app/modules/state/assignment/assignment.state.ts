import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Assignment, AssignmentStateModel } from '@models/assignment.model';
import { AssignmentActions } from './assignment.actions';
import { BaseState } from '@shared/state/base.state';
import { AssignmentService } from '@services/assignment.service';
import { SetLoading } from '@shared/state/loading/loading.actions';

@State<AssignmentStateModel>({
  name: 'assignment',
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
export class AssignmentState extends BaseState<Assignment> {
  constructor(private assignmentService: AssignmentService) {
    super(assignmentService);
  }

  @Selector()
  static getItems(state: AssignmentStateModel): Assignment[] {
    return state.filteredItems;
  }

  @Action(AssignmentActions.GetAll)
  getAll(ctx: StateContext<AssignmentStateModel>) {
    return this.getItems(ctx, AssignmentActions.GetAll.type);
  }

  @Action(AssignmentActions.DropFilter)
  dropFilter(ctx: StateContext<AssignmentStateModel>, { payload }: AssignmentActions.DropFilter) {
    ctx.dispatch(new SetLoading(AssignmentActions.DropFilter.type, true));
    const state = ctx.getState();
    const filtered = state.entities.filter(item => {
      return (
        (!payload.companyId || item.unit.customer.company.id === payload.companyId) &&
        (!payload.customerId || item.unit.customer.id === payload.customerId) &&
        (!payload.unitId || item.unit.id === payload.unitId) &&
        (!payload.shiftId || item.shift.id === payload.shiftId)
      )
    })
    ctx.patchState({ filteredItems: filtered });
    ctx.dispatch(new SetLoading(AssignmentActions.DropFilter.type, false));
  }
}
