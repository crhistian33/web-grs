import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { CollapseState, CollapseStateModel } from './collapse.state';
import { CollapseAction } from './collapse.actions';

describe('Collapse store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideStore([CollapseState])]
      
    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: CollapseStateModel = {
      items: ['item-1']
    };
    store.dispatch(new CollapseAction('item-1'));
    const actual = store.selectSnapshot(CollapseState.getState);
    expect(actual).toEqual(expected);
  });

});
