import { TypeWorker } from "@models/type-worker.model";
import { FilterStateModel } from "@shared/models/filter.model";

export namespace TypeWorkerActions {
  export class GetAll {
    static readonly type = '[TypeWorker] Get All';
  }

  export class GetDeletes {
    static readonly type = '[TypeWorker] Get All Deletes';
  }

  export class GetById {
    static readonly type = '[TypeWorker] Get By Id';
    constructor(public id: number) {}
  }

  export class countDeletes {
    static readonly type = '[TypeWorker] Count Deletes';
  }

  export class Filters<T> {
    static readonly type = '[TypeWorker] Filters Entities';
    constructor(public payload: Partial<FilterStateModel>, public columns?: (keyof T)[]) {}
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
    constructor(public payload: TypeWorker[], public del: boolean, public active: boolean) {}
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

  export class ClearItemSelection {
    static readonly type = '[TypeWorker] Clear Selection';
  }

  export class clearEntity {
    static readonly type = '[TypeWorker] Clear entity';
  }

  export class clearAll {
    static readonly type = '[TypeWorker] Clear All';
  }
}
