import { WorkerUpload } from "@models/worker.model";

export namespace FileUploadAction {
  export class ProcessExcelFile {
    static readonly type = '[Workers] Process Excel File';
    constructor(public file: File) {}
  }

  export class UploadWorkers {
    static readonly type = '[Workers] Upload';
    constructor(public workers: WorkerUpload[]) {}
  }

  export class ResetWorkerState {
    static readonly type = '[Workers] Reset State';
  }
}
