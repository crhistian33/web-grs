import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { FileUploadAction } from './file-upload.actions';
import { WorkerUpload } from '@models/worker.model';
import { ExcelService } from '@shared/services/excel.service';
import { catchError, tap, throwError } from 'rxjs';
import { WorkerService } from '@services/worker.service';

export interface FileUploadStateModel {
  workers: WorkerUpload[] | null
}

@State<FileUploadStateModel>({
  name: 'fileUpload',
  defaults: {
    workers: []
  }
})
@Injectable()
export class FileUploadState {
  private readonly excelService = inject(ExcelService);
  private readonly workerService = inject(WorkerService);

  @Selector()
  static getItemsUpload(state: FileUploadStateModel) {
    return state.workers;
  }

  @Action(FileUploadAction.ProcessExcelFile)
  processExcelFile(ctx: StateContext<FileUploadStateModel>, action: FileUploadAction.ProcessExcelFile) {
    //ctx.patchState({ loading: true, error: null });

    return this.excelService.processFile(action.file).pipe(
      tap(data => {
        ctx.patchState({
          workers: data,
        });
      }),
      catchError(error => {
        ctx.patchState({
          workers: null
        });
        return throwError(() => error);
      })
    );
  }

  @Action(FileUploadAction.UploadWorkers)
  uploadWorkers(ctx: StateContext<FileUploadStateModel>, action: FileUploadAction.UploadWorkers) {

    const payload = { workers: action.workers };

    return this.workerService.uploadWorkers(payload).pipe(
      tap(() => {
        ctx.patchState({
          workers: null
        });
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  @Action(FileUploadAction.ResetWorkerState)
  resetState(ctx: StateContext<FileUploadStateModel>) {
    ctx.setState({ workers: null });
  }
}
