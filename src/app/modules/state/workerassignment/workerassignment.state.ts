import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { WorkerAssignment, WorkerAssignmentRequest, WorkerassignmentStateModel } from '@models/workerassignment.model';
import { BaseState } from '@shared/state/base.state';
import { WorkerAssignmentActions } from './workerassignment.actions';
import { WorkerassignmentService } from '@services/workerassignment.service';
import { SetLoading } from '@shared/state/loading/loading.actions';
import { tap } from 'rxjs';

@State<WorkerassignmentStateModel>({
  name: 'workerassignment',
  defaults: {
    entities: [],
    filteredItems: [],
    trashedItems: [],
    filterTrashedItems: [],
    selectedEntity: null,
    searchTerm: '',
    result: null,
  },
})

@Injectable()
export class WorkerassignmentState extends BaseState<WorkerAssignment, WorkerAssignmentRequest> {
  constructor(private workerassignmentService: WorkerassignmentService) {
    super(workerassignmentService);
  }

  @Selector()
  static getState(state: WorkerassignmentStateModel) {
    return state;
  }

  @Selector()
  static getItems(state: WorkerassignmentStateModel) {
    return state.filteredItems;
  }

  @Selector()
  static getSelectedItems(state: WorkerassignmentStateModel) {
    return state.entities.filter(entity => entity.selected);
  }

  @Selector()
  static areAllSelected(state: WorkerassignmentStateModel) {
    return state.entities.length > 0 && state.entities.every(entity => entity.selected);
  }

  @Selector()
  static hasSelectedItems(state: WorkerassignmentStateModel) {
    return state.entities.some(entity => entity.selected);
  }

  @Action(WorkerAssignmentActions.GetAll)
  getAll(ctx: StateContext<WorkerassignmentStateModel>, { id }: WorkerAssignmentActions.GetAll) {
    return this.getItemsAll(ctx, WorkerAssignmentActions.GetAll.type, id)
  }

  @Action(WorkerAssignmentActions.GetWorkerToUnit)
  getWorkerToUnit(ctx: StateContext<WorkerassignmentStateModel>, { unit_shift_id, today }: WorkerAssignmentActions.GetWorkerToUnit) {
    const state = ctx.getState();
    const type = WorkerAssignmentActions.GetWorkerToUnit.type;
    ctx.dispatch(new SetLoading(type, true));

    return this.workerassignmentService.getWorkerToUnit(unit_shift_id, today).pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities: response.data,
            filteredItems: response.data,
          })
        },
        error: (error) => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    );
  }

  @Action(WorkerAssignmentActions.Update)
  update(ctx: StateContext<WorkerassignmentStateModel>, { id, payload }: WorkerAssignmentActions.Update) {
    return this.updateItem(ctx, payload, id, WorkerAssignmentActions.Update.type)
  }

  @Action(WorkerAssignmentActions.Delete)
  delete(ctx: StateContext<WorkerassignmentStateModel>, { id, del, page }: WorkerAssignmentActions.Delete) {
    return this.deleteItem(ctx, id, del, WorkerAssignmentActions.Delete.type, page)
  }

  @Action(WorkerAssignmentActions.DeleteAll)
  deleteAll(ctx: StateContext<WorkerassignmentStateModel>, { payload, del, active }: WorkerAssignmentActions.DeleteAll) {
    return this.deleteAllItem(ctx, payload, del, active, WorkerAssignmentActions.DeleteAll.type)
  }

  @Action(WorkerAssignmentActions.ToggleItemSelection)
  toggleSelection(ctx: StateContext<WorkerassignmentStateModel>, { id, page }: WorkerAssignmentActions.ToggleItemSelection) {
    return this.toggleSelectionItem(ctx, id, page)
  }

  @Action(WorkerAssignmentActions.ToggleAllItems)
  toggleAll(ctx: StateContext<WorkerassignmentStateModel>, { selected, page }: WorkerAssignmentActions.ToggleAllItems) {
    return this.toggleAllItem(ctx, selected, page)
  }

  @Action(WorkerAssignmentActions.Filters)
  Filters(ctx: StateContext<WorkerassignmentStateModel>, { payload, page, columns }: WorkerAssignmentActions.Filters<WorkerAssignment>) {
    return super.filtersItems(ctx, WorkerAssignmentActions.Filters.type, payload, columns, page);
  }
}
