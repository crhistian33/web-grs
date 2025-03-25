import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { VerifiedAction } from './verified.actions';
import { UnitshiftService } from '@services/unitshift.service';
import { tap } from 'rxjs';
import { SetLoading } from '../loading/loading.actions';

export interface VerifiedStateModel {
  verified: boolean;
}

@State<VerifiedStateModel>({
  name: 'verified',
  defaults: {
    verified: false
  }
})
@Injectable()
export class VerifiedState {
  private readonly unitshiftService = inject(UnitshiftService);

  @Selector()
  static getVerified(state: VerifiedStateModel) {
    return state.verified;
  }

  @Action(VerifiedAction.IfAssign)
  verifiedUnitShift(ctx: StateContext<VerifiedStateModel>, { id, assign_id }: VerifiedAction.IfAssign) {
    const state = ctx.getState();
    const type = VerifiedAction.IfAssign.type;
    ctx.dispatch(new SetLoading(type, true));
    return this.unitshiftService.verifiedIfAssign(id, assign_id).pipe(
      tap({
        next: (verified: boolean) => {
          ctx.setState({
            ...state,
            verified
          })
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        complete: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    )
  }
}
