import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Worker, WorkerStateModel } from '@models/worker.model';
import { WorkerService } from '@services/worker.service';
import { BaseState } from '@shared/state/base.state';
import { WorkerActions } from './worker.action';
import { SetLoading } from '@shared/state/loading/loading.actions';
import { tap } from 'rxjs';
import { BaseActions } from '@shared/state/base.actions';

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
  static getEntity(state: WorkerStateModel): Worker | null {
    return state.selectedEntity;
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

  @Action(WorkerActions.GetAssignsId)
  getAssigns(ctx: StateContext<WorkerStateModel>, { id }: WorkerActions.GetAssignsId) {
    ctx.dispatch(new SetLoading(WorkerActions.GetAssignsId.type, true));
    return this.workerService.getAssignsId(id).pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({ entities: response.data, filteredItems: response.data })
        },
        error: () => {
          ctx.dispatch(new SetLoading(WorkerActions.GetAssignsId.type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(WorkerActions.GetAssignsId.type, false));
        }
      })
    );
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
  deleteAll(ctx: StateContext<WorkerStateModel>, { payload, del, active }: WorkerActions.DeleteAll) {
    return this.deleteAllItem(ctx, payload, del, active, WorkerActions.DeleteAll.type)
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

  @Action(WorkerActions.Filters)
  Filters(ctx: StateContext<WorkerStateModel>, { payload, columns }: WorkerActions.Filters<Worker>) {
    return super.filtersItems(ctx, WorkerActions.Filters.type, payload, columns);
  }

  @Action(WorkerActions.GetUnassignment)
  getUnassignments(ctx: StateContext<WorkerStateModel>) {
    ctx.dispatch(new SetLoading(WorkerActions.GetUnassignment.type, true));
    return this.workerService.getUnassignments().pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities: response.data,
            filteredItems: response.data,
          })
        },
        error: () => {
          ctx.dispatch(new SetLoading(WorkerActions.GetUnassignment.type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(WorkerActions.GetUnassignment.type, false));
        }
      })
    )
  }

  @Action(WorkerActions.GetTitulars)
  getTitulars(ctx: StateContext<WorkerStateModel>) {
    ctx.dispatch(new SetLoading(WorkerActions.GetTitulars.type, true));
    return this.workerService.getTitulars().pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities: response.data,
            filteredItems: response.data,
          })
        },
        error: () => {
          ctx.dispatch(new SetLoading(WorkerActions.GetTitulars.type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(WorkerActions.GetTitulars.type, false));
        }
      })
    )
  }

  @Action(WorkerActions.clearEntity)
  clearItem(ctx: StateContext<WorkerStateModel>) {
    return this.clearEntity(ctx);
  }

  @Action(WorkerActions.ClearItemSelection)
  clearSelected(ctx: StateContext<WorkerStateModel>) {
    return this.clearSelectionItem(ctx);
  }

  @Action(WorkerActions.clearAll)
  clearAll(ctx: StateContext<WorkerStateModel>) {
    return this.clearAllItems(ctx);
  }
}
