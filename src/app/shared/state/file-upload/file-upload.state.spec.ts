import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { FileUploadState, FileUploadStateModel } from './file-upload.state';
import { FileUploadAction } from './file-upload.actions';

describe('FileUpload store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideStore([FileUploadState])]
      
    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: FileUploadStateModel = {
      items: ['item-1']
    };
    store.dispatch(new FileUploadAction('item-1'));
    const actual = store.selectSnapshot(FileUploadState.getState);
    expect(actual).toEqual(expected);
  });

});
