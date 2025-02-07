import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { CalendarState, CalendarStateModel } from './calendar.state';
import { CalendarAction } from './calendar.actions';

describe('Calendar store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideStore([CalendarState])]
      
    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: CalendarStateModel = {
      items: ['item-1']
    };
    store.dispatch(new CalendarAction('item-1'));
    const actual = store.selectSnapshot(CalendarState.getState);
    expect(actual).toEqual(expected);
  });

});
