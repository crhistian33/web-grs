import { Injectable } from '@angular/core';
import { Assist, AssistRequest, AssistStateModel } from '@models/assist.model';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AssistService } from '@services/assist.service';
import { BaseState } from '@shared/state/base.state';
import { AssistActions } from './assist.actions';
import { SetLoading } from '@shared/state/loading/loading.actions';
import { tap } from 'rxjs';

@State<AssistStateModel>({
  name: 'assist',
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
export class AssistState extends BaseState<Assist, AssistRequest> {
  constructor(private assistService: AssistService) {
    super(assistService);
  }

  @Selector()
  static getItems(state: AssistStateModel): Assist[] {
    return state.filteredItems;
  }

  @Selector()
  static getSelectedItems(state: AssistStateModel) {
    return state.entities.filter((entity) => entity.selected);
  }

  @Selector()
  static areAllSelected(state: AssistStateModel) {
    return (
      state.entities.length > 0 &&
      state.entities.every((entity) => entity.selected)
    );
  }

  @Selector()
  static hasSelectedItems(state: AssistStateModel) {
    return state.entities.some((entity) => entity.selected);
  }

  @Selector([AssistState])
  static getWorkerAssistDay(state: AssistStateModel) {
    return state.selectedEntity;
  }

  @Action(AssistActions.GetAll)
  getAll(ctx: StateContext<AssistStateModel>, { payload }: AssistActions.GetAll) {
    const type = AssistActions.GetAll.type;

    ctx.dispatch(new SetLoading(type, true));

    return this.assistService.getWorkersAssist(payload).pipe(
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

  @Action(AssistActions.GetAllBreaks)
  getAllBreaks(ctx: StateContext<AssistStateModel>, { payload }: AssistActions.GetAllBreaks) {
    const type = AssistActions.GetAllBreaks.type;

    ctx.dispatch(new SetLoading(type, true));

    return this.assistService.getWorkersAssistBreaks(payload).pipe(
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

  @Action(AssistActions.GetAssistDay)
  getAssistDay(ctx: StateContext<AssistStateModel>, { id, date }: AssistActions.GetAssistDay) {
    const state = ctx.getState();
    if(id === null || date === null)
      return;

    const workerAssist = state.entities.find(entity => entity.id === id);
    if(!workerAssist)
      return;

    const filteredDays = workerAssist.days.filter(item => item.key === date);

    return ctx.patchState({
      selectedEntity: { ...workerAssist, days: filteredDays }
    })
  }

  @Action(AssistActions.Filters)
  Filters(ctx: StateContext<AssistStateModel>, { payload, page, columns }: AssistActions.Filters<Assist>) {
    return this.filtersItems(ctx, AssistActions.Filters.type, payload, columns, page);
  }

  @Action(AssistActions.clearAll)
  clearAll(ctx: StateContext<AssistStateModel>) {
    return this.clearAllItems(ctx);
  }
}
