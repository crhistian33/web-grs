import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { CalendarAction } from './calendar.actions';

export interface CalendarStateModel {
  selectedItemId: number | null;
  selectedDays: { [key: string]: number };
}

const initialValues = {
  selectedItemId: null,
  selectedDays: {},
}

@State<CalendarStateModel>({
  name: 'calendar',
  defaults: initialValues,
})
@Injectable()
export class CalendarState {

  @Selector()
  static selectedItemId(state: CalendarStateModel) {
    return state.selectedItemId;
  }

  @Selector()
  static selectedDays(state: CalendarStateModel) {
    return state.selectedDays;
  }

  @Action(CalendarAction.SelectItem)
  selectWorker(ctx: StateContext<CalendarStateModel>, action: CalendarAction.SelectItem) {
    ctx.patchState({ selectedItemId: action.id });
  }

  @Action(CalendarAction.ToggleDaySelection)
  toggleDaySelection(
    ctx: StateContext<CalendarStateModel>,
    action: CalendarAction.ToggleDaySelection
  ) {
    const state = ctx.getState();
    const { selectedDays, selectedItemId } = state;

    if (!selectedItemId) return;

    const newSelectedDays = { ...selectedDays };

    if (newSelectedDays[action.date] === selectedItemId) {
      delete newSelectedDays[action.date];
    } else {
      newSelectedDays[action.date] = selectedItemId;
    }

    ctx.patchState({ selectedDays: newSelectedDays });
  }

  @Action(CalendarAction.ClearCalendar)
  clear(ctx: StateContext<CalendarStateModel>) {
    ctx.patchState(initialValues);
  }
}
