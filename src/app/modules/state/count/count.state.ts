import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { CountActions } from './count.actions';
import { Count } from '@models/counts.model';
import { CountService } from '@services/count.service';
import { SetLoading } from '@shared/state/loading/loading.actions';
import { tap } from 'rxjs';

export interface CountStateModel {
  counts: Count | null;
}

@State<CountStateModel>({
  name: 'count',
  defaults: {
    counts: null
  }
})
@Injectable()
export class CountState {
  private readonly countService = inject(CountService);

  @Selector()
  static getCounts(state: CountStateModel) {
    return state.counts;
  }

  @Action(CountActions.GetCounts)
  getCounts(ctx: StateContext<CountStateModel>) {
    console.log('Counts');
    ctx.dispatch(new SetLoading(CountActions.GetCounts.type, true));
    return this.countService.getCounts()
    .pipe(
      tap({
        next: (counts) => {
          console.log('Serives count');
          ctx.patchState({
            counts,
        });
        },
        error: () => {
          console.log('Serives count 2');
          ctx.dispatch(new SetLoading(CountActions.GetCounts.type, false));
        },
        complete: () => {
          console.log('Serives count 3');
          ctx.dispatch(new SetLoading(CountActions.GetCounts.type, false));
        }
      })
    )
  }

  @Action(CountActions.ClearCounts)
  clearCounts(ctx: StateContext<CountStateModel>) {
    return ctx.patchState({ counts: null });
  }
}
