import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Assignment, AssignmentRequest, AssignmentStateModel } from '@models/assignment.model';
import { AssignmentActions } from './assignment.actions';
import { BaseState } from '@shared/state/base.state';
import { AssignmentService } from '@services/assignment.service';
import { SetLoading } from '@shared/state/loading/loading.actions';
import { tap } from 'rxjs';

@State<AssignmentStateModel>({
  name: 'assignment',
  defaults: {
    entities: [],
    filteredItems: [],
    trashedItems: [],
    filterTrashedItems: [],
    selectedEntity: null,
    searchTerm: '',
    result: null,
  }
})
@Injectable()
export class AssignmentState extends BaseState<Assignment, AssignmentRequest> {
  constructor(private assignmentService: AssignmentService) {
    super(assignmentService);
  }

  @Selector()
  static getItems(state: AssignmentStateModel): Assignment[] {
    return state.filteredItems;
  }

  @Selector()
  static getEntity(state: AssignmentStateModel): Assignment | null {
    return state.selectedEntity;
  }

  @Selector()
  static getSelectedItems(state: AssignmentStateModel) {
    return state.entities.filter((entity) => entity.selected);
  }

  @Selector()
  static getUnitShiftsActive(state: AssignmentStateModel) {
    return state.entities
      .filter(assignment => assignment.state)
      .map(assignment => assignment.unitshift)
  }

  @Selector()
  static areAllSelected(state: AssignmentStateModel) {
    return (
      state.entities.length > 0 &&
      state.entities.every((entity) => entity.selected)
    );
  }

  @Selector()
  static hasSelectedItems(state: AssignmentStateModel) {
    return state.entities.some((entity) => entity.selected);
  }

  @Action(AssignmentActions.GetAll)
  getAll(ctx: StateContext<AssignmentStateModel>, { id }: AssignmentActions.GetAll) {
    return this.getItemsAll(ctx, AssignmentActions.GetAll.type, id);
  }

  @Action(AssignmentActions.GetWorkerAssigns)
  protected getAllReassigns(ctx: StateContext<AssignmentStateModel>) {
    ctx.dispatch(new SetLoading(AssignmentActions.GetWorkerAssigns.type, true));
    return this.assignmentService.getReassignments().pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities: response.data,
            filteredItems: response.data,
          })
        },
        error: (error) => {
          ctx.dispatch(new SetLoading(AssignmentActions.GetWorkerAssigns.type, false));
          // const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(AssignmentActions.GetWorkerAssigns.type, false));
        }
      })
    );
  }

  @Action(AssignmentActions.GetById)
  getByID(ctx: StateContext<AssignmentStateModel>, { id }: AssignmentActions.GetById) {
    return this.getOne(ctx, id, AssignmentActions.GetById.type);
  }

  @Action(AssignmentActions.Filters)
  Filters(ctx: StateContext<AssignmentStateModel>, { payload, page, columns }: AssignmentActions.Filters<Assignment>) {
    return super.filtersItems(ctx, AssignmentActions.Filters.type, payload, columns, page);
  }

  @Action(AssignmentActions.Create)
  create(ctx: StateContext<AssignmentStateModel>, { payload }: AssignmentActions.Create) {
    return this.createItem(ctx, payload, AssignmentActions.Create.type);
  }

  @Action(AssignmentActions.Update)
  update(ctx: StateContext<AssignmentStateModel>, { id, payload }: AssignmentActions.Update) {
    return this.updateItem(ctx, payload, id, AssignmentActions.Update.type);
  }

  @Action(AssignmentActions.Desactivate)
  desactivate(ctx: StateContext<AssignmentStateModel>, { id }: AssignmentActions.Desactivate) {
    const type = AssignmentActions.Desactivate.type;
    ctx.dispatch(new SetLoading(type, true));
    return this.assignmentService.desactivate(id).pipe(
      tap({
        error: (error) => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    );
  }

  @Action(AssignmentActions.Delete)
  delete(ctx: StateContext<AssignmentStateModel>, { id, del, page }: AssignmentActions.Delete) {
    return this.deleteItem(ctx, id, del, AssignmentActions.Delete.type, page);
  }

  @Action(AssignmentActions.DeleteAll)
  deleteAll(ctx: StateContext<AssignmentStateModel>, { payload, del, active, page }: AssignmentActions.DeleteAll) {
    return this.deleteAllItem(ctx, payload, del, active, AssignmentActions.DeleteAll.type, page);
  }

  @Action(AssignmentActions.ToggleItemSelection)
  toggleSelection(ctx: StateContext<AssignmentStateModel>, { id, page }: AssignmentActions.ToggleItemSelection) {
    return this.toggleSelectionItem(ctx, id, page);
  }

  @Action(AssignmentActions.ToggleAllItems)
  toggleAll(ctx: StateContext<AssignmentStateModel>, { selected, page }: AssignmentActions.ToggleAllItems) {
    return this.toggleAllItem(ctx, selected, page);
  }

  @Action(AssignmentActions.clearEntity)
  clearItem(ctx: StateContext<AssignmentStateModel>) {
    return this.clearEntity(ctx);
  }

  @Action(AssignmentActions.ClearItemSelection)
  clearSelected(ctx: StateContext<AssignmentStateModel>) {
    return this.clearSelectionItem(ctx);
  }

  @Action(AssignmentActions.clearAll)
  clearAll(ctx: StateContext<AssignmentStateModel>) {
    return this.clearAllItems(ctx);
  }

  @Action(AssignmentActions.verifiedUnitShift)
  verified(ctx: StateContext<AssignmentStateModel>,  { id }: AssignmentActions.verifiedUnitShift) {
    return this.assignmentService.verfiiedAssign(id)
  }
}
