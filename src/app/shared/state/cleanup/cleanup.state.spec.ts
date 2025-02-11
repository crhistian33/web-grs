import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { CleanupState, CleanupStateModel } from './cleanup.state';
import { CleanupAction } from './cleanup.actions';

describe('Cleanup store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideStore([CleanupState])]
      
    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: CleanupStateModel = {
      items: ['item-1']
    };
    store.dispatch(new CleanupAction('item-1'));
    const actual = store.selectSnapshot(CleanupState.getState);
    expect(actual).toEqual(expected);
  });

});
