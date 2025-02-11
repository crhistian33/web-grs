import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { CleanupAction } from './cleanup.actions';

@State({
  name: 'cleanup',
  defaults: {}
})
@Injectable()
export class CleanupState {

  @Action(CleanupAction.ClearAllStates)
  clearAllStates() {
    return;
  }
}
