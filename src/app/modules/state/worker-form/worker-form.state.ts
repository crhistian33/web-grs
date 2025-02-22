import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { WorkerFormAction } from './worker-form.actions';
import { Worker, WorkerRequest, WorkerStateModel } from '@models/worker.model';
import { WorkerService } from '@services/worker.service';
import { BaseState } from '@shared/state/base.state';
import { SetLoading } from '@shared/state/loading/loading.actions';
import { tap } from 'rxjs';

@State<WorkerStateModel>({
  name: 'workerForm',
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
export class WorkerFormState extends BaseState<Worker, WorkerRequest> {
  constructor(private workerService: WorkerService) {
    super(workerService);
  }
  @Selector()
  static getItems(state: WorkerStateModel): Worker[] {
    return state.filteredItems;
  }

  @Selector()
  static getSelectedItems(state: WorkerStateModel) {
    return state.entities.filter(entity => entity.selected);
  }

  @Selector()
  static areAllSelected(state: WorkerStateModel) {
    return state.entities.length > 0 && state.entities.every(entity => entity.selected);
  }


  @Action(WorkerFormAction.GetUnassigns)
  getUnassigns(ctx: StateContext<WorkerStateModel>, { payload }: WorkerFormAction.GetUnassigns) {
    ctx.dispatch(new SetLoading(WorkerFormAction.GetUnassigns.type, true));
    const service = this.workerService.getUnassigns(payload)

    return service.pipe(
      tap({
        next: (response: any) => {
          console.log('RESPONSE', response.data);
          ctx.patchState({
            entities: response.data,
            filteredItems: response.data,
          })
        },
        error: () => {
          ctx.dispatch(new SetLoading(WorkerFormAction.GetUnassigns.type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(WorkerFormAction.GetUnassigns.type, false));
        }
      })
    )
  }

  @Action(WorkerFormAction.ToggleItemSelection)
  toggleSelection(ctx: StateContext<WorkerStateModel>, { id, page }: WorkerFormAction.ToggleItemSelection) {
    return this.toggleSelectionItem(ctx, id, page)
  }

  @Action(WorkerFormAction.ToggleAllItems)
  toggleAll(ctx: StateContext<WorkerStateModel>, { selected, page }: WorkerFormAction.ToggleAllItems) {
    return this.toggleAllItem(ctx, selected, page)
  }

  @Action(WorkerFormAction.ClearItemSelection)
  clearSelection(ctx: StateContext<WorkerStateModel>) {
    return this.clearSelectionItem(ctx);
  }

  @Action(WorkerFormAction.clearAll)
  clearAll(ctx: StateContext<WorkerStateModel>) {
    return this.clearAllItems(ctx);
  }
}
