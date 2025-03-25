import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { InassistAction } from './inassist.actions';
import { Inassist, InassistRequest, InassistStateModel } from '@models/inassist.model';
import { BaseState } from '@shared/state/base.state';
import { InassistService } from '@services/inassist.service';
import { SetLoading } from '@shared/state/loading/loading.actions';
import { tap } from 'rxjs';

@State<InassistStateModel>({
  name: 'inassist',
  defaults: {
    entities: [],
    filteredItems: [],
    trashedItems: [],
    filterTrashedItems: [],
    days: [],
    selectedEntity: null,
    searchTerm: '',
    result: null,
  }
})

@Injectable()
export class InassistState extends BaseState<Inassist, InassistRequest> {
  constructor(private inassistService: InassistService) {
    super(inassistService);
  }

  @Selector()
  static getItems(state: InassistStateModel) {
    return state.filteredItems;
  }

  @Selector()
  static getDays(state: InassistStateModel) {
    return state.days ?? [];
  }

  @Selector()
  static getSelectedItems(state: InassistStateModel) {
    return state.entities.filter((entity) => entity.selected);
  }

  @Selector()
  static areAllSelected(state: InassistStateModel) {
    return (
      state.entities.length > 0 &&
      state.entities.every((entity) => entity.selected)
    );
  }

  @Selector()
  static hasSelectedItems(state: InassistStateModel) {
    return state.entities.some((entity) => entity.selected);
  }

  @Action(InassistAction.CreateMany)
  createMany(ctx: StateContext<InassistStateModel>, { payload }: InassistAction.CreateMany) {
    return this.createManyItem(ctx, payload, InassistAction.CreateMany.type);
  }

  @Action(InassistAction.GetAll)
  getAll(ctx: StateContext<InassistStateModel>, { id }: InassistAction.GetAll) {
    return this.getItemsAll(ctx, InassistAction.GetAll.type, id);
  }

  @Action(InassistAction.GetDaysUnit)
  getDaysUnitMonth(ctx: StateContext<InassistStateModel>, {unit_shift_id, month}: InassistAction.GetDaysUnit) {
    const type = InassistAction.GetDaysUnit.type;
    ctx.dispatch(new SetLoading(type, true));

    return this.inassistService.getDaysUnitMonth(unit_shift_id, month).pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            days: response.data,
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

  @Action(InassistAction.Filters)
  Filters(ctx: StateContext<InassistStateModel>, { payload, columns, page }: InassistAction.Filters<Inassist>) {
    return super.filtersItems(ctx, InassistAction.Filters.type, payload, columns, page);
  }

  @Action(InassistAction.Delete)
  delete(ctx: StateContext<InassistStateModel>, { worker_id, month }: InassistAction.Delete) {
    const type = InassistAction.Delete.type;
    ctx.dispatch(new SetLoading(type, true));

    const state = ctx.getState();
    const entities = state.entities.filter(item => !(item.worker.id === worker_id && item.month === month));
    return this.inassistService.deleteInassists(worker_id, month).pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({ entities, filteredItems: entities, result: { title: response.title, message: response.message } })
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    )
  }

  @Action(InassistAction.DeleteAll)
  deleteAll(ctx: StateContext<InassistStateModel>, { payload }: InassistAction.DeleteAll) {
    const type = InassistAction.DeleteAll.type;
    ctx.dispatch(new SetLoading(type, true));
    const state = ctx.getState();

    const entities = state.entities.filter(item => !payload.some(element => element.worker_id === item.worker.id && element.month === item.month));

    return this.inassistService.deleteManyInassists(payload).pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({ entities, filteredItems: entities, result: { title: response.title, message: response.message } })

        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    )
  }

  @Action(InassistAction.ToggleItemSelection)
  toggleSelection(ctx: StateContext<InassistStateModel>, { id, page }: InassistAction.ToggleItemSelection) {
    return this.toggleSelectionItem(ctx, id, page);
  }

  @Action(InassistAction.ToggleAllItems)
  toggleAll(ctx: StateContext<InassistStateModel>, { selected, page }: InassistAction.ToggleAllItems) {
    return this.toggleAllItem(ctx, selected, page);
  }

  @Action(InassistAction.ClearItemSelection)
  clearSelection(ctx: StateContext<InassistStateModel>) {
    return this.clearSelectionItem(ctx);
  }

  @Action(InassistAction.ClearAll)
  clearAll(ctx: StateContext<InassistStateModel>) {
    return this.clearAllItems(ctx);
  }
}
