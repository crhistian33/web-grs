import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Worker, WorkerRequest, WorkerStateModel } from '@models/worker.model';
import { WorkerService } from '@services/worker.service';
import { BaseState } from '@shared/state/base.state';
import { WorkerActions } from './worker.action';
import { SetLoading } from '@shared/state/loading/loading.actions';
import { tap } from 'rxjs';
import { ExcelService } from '@shared/services/excel.service';

@State<WorkerStateModel>({
  name: 'worker',
  defaults: {
    entities: [],
    filteredItems: [],
    trashedItems: [],
    filterTrashedItems: [],
    selectedEntity: null,
    searchTerm: '',
    loaded: false,
    result: null,
  },
})

@Injectable()
export class WorkerState extends BaseState<Worker, WorkerRequest> {
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
    return state.filterTrashedItems;
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

  @Selector()
  static getTrashedSelectedItems(state: WorkerStateModel) {
    return state.trashedItems.filter(entity => entity.selected);
  }

  @Selector()
  static areTrashedAllSelected(state: WorkerStateModel) {
    return state.trashedItems.length > 0 && state.trashedItems.every(entity => entity.selected);
  }

  @Selector()
  static hasTrashedSelectedItems(state: WorkerStateModel) {
    return state.trashedItems.some(entity => entity.selected);
  }

  @Action(WorkerActions.GetAll)
  getAll(ctx: StateContext<WorkerStateModel>, { id }: WorkerActions.GetAll) {
    return this.getItemsAll(ctx, WorkerActions.GetAll.type, id);
  }

  @Action(WorkerActions.GetTrasheds)
  getTrasheds(ctx: StateContext<WorkerStateModel>, { id }: WorkerActions.GetTrasheds) {
    return this.getItemsTrasheds(ctx, WorkerActions.GetTrasheds.type, id);
  }

  @Action(WorkerActions.GetById)
  getByID(ctx: StateContext<WorkerStateModel>, { id }: WorkerActions.GetById) {
    return this.getOne(ctx, id, WorkerActions.GetById.type)
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

  @Action(WorkerActions.GetUnassignment)
  getUnassigns(ctx: StateContext<WorkerStateModel>, { id }: WorkerActions.GetUnassignment) {
    ctx.dispatch(new SetLoading(WorkerActions.GetUnassignment.type, true));
    const service = id
      ? this.workerService.getUnassigns(id)
      : this.workerService.getUnassigns();

    return service.pipe(
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

  @Action(WorkerActions.Filters)
  Filters(ctx: StateContext<WorkerStateModel>, { payload, page, columns }: WorkerActions.Filters<Worker>) {
    return super.filtersItems(ctx, WorkerActions.Filters.type, payload, columns, page);
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
  delete(ctx: StateContext<WorkerStateModel>, { id, del, page }: WorkerActions.Delete) {
    return this.deleteItem(ctx, id, del, WorkerActions.Delete.type, page)
  }

  @Action(WorkerActions.DeleteAll)
  deleteAll(ctx: StateContext<WorkerStateModel>, { payload, del, active, page, id }: WorkerActions.DeleteAll) {
    return this.deleteAllItem(ctx, payload, del, active, WorkerActions.DeleteAll.type, page, id)
  }

  @Action(WorkerActions.Restore)
  restore(ctx: StateContext<WorkerStateModel>, { id }: WorkerActions.Restore) {
    return this.restoreItem(ctx, id, WorkerActions.Restore.type)
  }

  @Action(WorkerActions.RestoreAll)
  restoreAll(ctx: StateContext<WorkerStateModel>, { payload }: WorkerActions.RestoreAll) {
    return this.restoreAllItem(ctx, payload, WorkerActions.RestoreAll.type)
  }

  @Action(WorkerActions.ToggleItemSelection)
  toggleSelection(ctx: StateContext<WorkerStateModel>, { id, page }: WorkerActions.ToggleItemSelection) {
    return this.toggleSelectionItem(ctx, id, page)
  }

  @Action(WorkerActions.ToggleAllItems)
  toggleAll(ctx: StateContext<WorkerStateModel>, { selected, page }: WorkerActions.ToggleAllItems) {
    return this.toggleAllItem(ctx, selected, page)
  }

  @Action(WorkerActions.clearEntity)
  clearItem(ctx: StateContext<WorkerStateModel>) {
    return this.clearEntity(ctx);
  }

  @Action(WorkerActions.ClearItemSelection)
  clearSelection(ctx: StateContext<WorkerStateModel>) {
    return this.clearSelectionItem(ctx);
  }

  @Action(WorkerActions.clearAll)
  clearAll(ctx: StateContext<WorkerStateModel>) {
    return this.clearAllItems(ctx);
  }
}
