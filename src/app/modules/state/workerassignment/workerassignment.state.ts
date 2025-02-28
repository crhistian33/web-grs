import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { WorkerAssignment, WorkerAssignmentRequest, WorkerassignmentStateModel } from '@models/workerassignment.model';
import { BaseState } from '@shared/state/base.state';
import { WorkerAssignmentActions } from './workerassignment.actions';
import { WorkerassignmentService } from '@services/workerassignment.service';

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
  getAll(ctx: StateContext<WorkerassignmentStateModel>) {
    return this.getItems(ctx, WorkerAssignmentActions.GetAll.type)
  }

  @Action(WorkerAssignmentActions.Update)
  update(ctx: StateContext<WorkerassignmentStateModel>, { id, payload }: WorkerAssignmentActions.Update) {
    return this.updateItem(ctx, payload, id, WorkerAssignmentActions.Update.type)
  }

  @Action(WorkerAssignmentActions.Delete)
  delete(ctx: StateContext<WorkerassignmentStateModel>, { id, del }: WorkerAssignmentActions.Delete) {
    return this.deleteItem(ctx, id, del, WorkerAssignmentActions.Delete.type)
  }

  @Action(WorkerAssignmentActions.DeleteAll)
  deleteAll(ctx: StateContext<WorkerassignmentStateModel>, { payload, del, active }: WorkerAssignmentActions.DeleteAll) {
    return this.deleteAllItem(ctx, payload, del, active, WorkerAssignmentActions.DeleteAll.type)
  }

  @Action(WorkerAssignmentActions.ToggleItemSelection)
  toggleSelection(ctx: StateContext<WorkerassignmentStateModel>, { id }: WorkerAssignmentActions.ToggleItemSelection) {
    return this.toggleSelectionItem(ctx, id)
  }

  @Action(WorkerAssignmentActions.ToggleAllItems)
  toggleAll(ctx: StateContext<WorkerassignmentStateModel>, { selected }: WorkerAssignmentActions.ToggleAllItems) {
    return this.toggleAllItem(ctx, selected)
  }

  @Action(WorkerAssignmentActions.Filters)
  Filters(ctx: StateContext<WorkerassignmentStateModel>, { payload, columns }: WorkerAssignmentActions.Filters<WorkerAssignment>) {
    return super.filtersItems(ctx, WorkerAssignmentActions.Filters.type, payload, columns);
  }
}
