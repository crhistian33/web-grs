import { TypeWorker } from "@models/type-worker.model";

export namespace TypeWorkerActions {
  export class GetAll {
    static readonly type = '[TypeWorker] Get All';
  }

  export class GetDeletes {
    static readonly type = '[TypeWorker] Get All Deletes';
  }

  export class GetAllFilter<T> {
    static readonly type = '[TypeWorker] Get All Filter';
    constructor(public searchTerm: string, public columns: (keyof T)[]) {}
  }

  export class GetById {
    static readonly type = '[TypeWorker] Get By Id';
    constructor(public id: number) {}
  }

  export class countDeletes {
    static readonly type = '[TypeWorker] Count Deletes';
  }

  export class Create {
    static readonly type = '[TypeWorker] Create';
    constructor(public payload: TypeWorker) {}
  }

  export class Update {
    static readonly type = '[TypeWorker] Update';
    constructor(public id: number, public payload: Partial<TypeWorker>) {}
  }

  export class Delete {
    static readonly type = '[TypeWorker] Delete';
    constructor(public id: number, public del: boolean) {}
  }

  export class Restore {
    static readonly type = '[TypeWorker] Restore';
    constructor(public id: number) {}
  }

  export class DeleteAll {
    static readonly type = '[TypeWorker] Delete All';
    constructor(public payload: TypeWorker[], public del: boolean) {}
  }

  export class RestoreAll {
    static readonly type = '[TypeWorker] Restore All';
    constructor(public payload: TypeWorker[]) {}
  }

  export class ToggleItemSelection {
    static readonly type = '[TypeWorker] Toggle Selection';
    constructor(public id: number) {}
  }

  export class ToggleAllItems {
    static readonly type = '[TypeWorker] Toggle All';
    constructor(public selected: boolean) {}
  }
}
