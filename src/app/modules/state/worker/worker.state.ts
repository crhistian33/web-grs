import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Worker, WorkerStateModel } from '@models/worker.model';
import { WorkerService } from '@services/worker.service';
import { BaseState } from '@shared/state/base.state';
import { WorkerActions } from './worker.action';
import { SetLoading } from '@shared/state/loading/loading.actions';

@State<WorkerStateModel>({
  name: 'worker',
  defaults: {
    entities: [],
    filteredItems: [],
    trashedItems: [],
    selectedEntity: null,
    searchTerm: '',
    result: null,
  },
})

@Injectable()
export class WorkerState extends BaseState<Worker> {
  constructor(private workerService: WorkerService) {
    super(workerService);
  }

  @Selector()
  static getItems(state: WorkerStateModel): Worker[] {
    return state.filteredItems;
  }

  @Selector()
  static getTrasheds(state: WorkerStateModel): Worker[] {
    return state.trashedItems;
  }

  @Selector()
  static getSelectedItems(state: WorkerStateModel) {
    return state.entities.filter(entity => entity.selected);
  }

  @Selector()
  static areAllSelected(state: WorkerStateModel) {
    return state.entities.length > 0 && state.entities.every(entity => entity.selected);
  }

  @Selector()
  static hasSelectedItems(state: WorkerStateModel) {
    return state.entities.some(entity => entity.selected);
  }

  @Action(WorkerActions.GetAll)
  getAll(ctx: StateContext<WorkerStateModel>) {
    return this.getItems(ctx, WorkerActions.GetAll.type)
  }

  @Action(WorkerActions.GetDeletes)
  getDeletes(ctx: StateContext<WorkerStateModel>) {
    return this.getItemsDelete(ctx, WorkerActions.GetDeletes.type)
  }

  @Action(WorkerActions.GetById)
  getByID(ctx: StateContext<WorkerStateModel>, { id }: WorkerActions.GetById) {
    return this.getOne(ctx, id, WorkerActions.GetById.type)
  }

  @Action(WorkerActions.GetAllFilter)
  getAllFilter(ctx: StateContext<WorkerStateModel>, { searchTerm, columns }: WorkerActions.GetAllFilter<Worker>) {
    return this.getItemsFilter(ctx, searchTerm, columns)
  }

  @Action(WorkerActions.countDeletes)
  countTrasheds(ctx: StateContext<WorkerStateModel>) {
    return this.countItemsTrashed(ctx);
  }

  @Action(WorkerActions.Create)
  create(ctx: StateContext<WorkerStateModel>, { payload }: WorkerActions.Create) {
    return this.createItem(ctx, payload, WorkerActions.Create.type)
  }

  @Action(WorkerActions.Update)
  update(ctx: StateContext<WorkerStateModel>, { id, payload }: WorkerActions.Update) {
    return this.updateItem(ctx, payload, id, WorkerActions.Update.type)
  }

  @Action(WorkerActions.Delete)
  delete(ctx: StateContext<WorkerStateModel>, { id, del }: WorkerActions.Delete) {
    return this.deleteItem(ctx, id, del, WorkerActions.Delete.type)
  }

  @Action(WorkerActions.Restore)
  restore(ctx: StateContext<WorkerStateModel>, { id }: WorkerActions.Restore) {
    return this.restoreItem(ctx, id, WorkerActions.Restore.type)
  }

  @Action(WorkerActions.DeleteAll)
  deleteAll(ctx: StateContext<WorkerStateModel>, { payload, del }: WorkerActions.DeleteAll) {
    return this.deleteAllItem(ctx, payload, del, WorkerActions.DeleteAll.type)
  }

  @Action(WorkerActions.RestoreAll)
  restoreAll(ctx: StateContext<WorkerStateModel>, { payload }: WorkerActions.RestoreAll) {
    return this.restoreAllItem(ctx, payload, WorkerActions.RestoreAll.type)
  }

  @Action(WorkerActions.ToggleItemSelection)
  toggleSelection(ctx: StateContext<WorkerStateModel>, { id }: WorkerActions.ToggleItemSelection) {
    return this.toggleSelectionItem(ctx, id)
  }

  @Action(WorkerActions.ToggleAllItems)
  toggleAll(ctx: StateContext<WorkerStateModel>, { selected }: WorkerActions.ToggleAllItems) {
    return this.toggleAllItem(ctx, selected)
  }

  @Action(WorkerActions.DropFilter)
  dropFilter(ctx: StateContext<WorkerStateModel>, { payload }: WorkerActions.DropFilter) {
    ctx.dispatch(new SetLoading(WorkerActions.DropFilter.type, true));
    const state = ctx.getState();
    const filtered = state.entities.filter(item => {
      return (
        (!payload.typeworkerId || item.typeworker.id === payload.typeworkerId)
      )
    })
    ctx.patchState({ filteredItems: filtered });
    ctx.dispatch(new SetLoading(WorkerActions.DropFilter.type, false));
  }
}
