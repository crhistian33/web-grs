import { Worker } from "@models/worker.model";
import { FilterStateModel } from "@shared/models/filter.model";

export namespace WorkerActions {
  export class GetAll {
    static readonly type = '[Worker] Get All';
  }

  export class GetDeletes {
    static readonly type = '[Worker] Get All Deletes';
  }

  export class GetAllFilter<T> {
    static readonly type = '[Worker] Get All Filter';
    constructor(public searchTerm: string, public columns: (keyof T)[]) {}
  }

  export class GetById {
    static readonly type = '[Worker] Get By Id';
    constructor(public id: number) {}
  }

  export class countDeletes {
    static readonly type = '[Worker] Count Deletes';
  }

  export class DropFilter {
    static readonly type = '[Worker] Drop Filter';
    constructor(public payload: Partial<FilterStateModel>) {}
  }

  export class Create {
    static readonly type = '[Worker] Create';
    constructor(public payload: Worker) {}
  }

  export class Update {
    static readonly type = '[Worker] Update';
    constructor(public id: number, public payload: Partial<Worker>) {}
  }

  export class Delete {
    static readonly type = '[Worker] Delete';
    constructor(public id: number, public del: boolean) {}
  }

  export class Restore {
    static readonly type = '[Worker] Restore';
    constructor(public id: number) {}
  }

  export class DeleteAll {
    static readonly type = '[Worker] Delete All';
    constructor(public payload: Worker[], public del: boolean) {}
  }

  export class RestoreAll {
    static readonly type = '[Worker] Restore All';
    constructor(public payload: Worker[]) {}
  }

  export class ToggleItemSelection {
    static readonly type = '[Worker] Toggle Selection';
    constructor(public id: number) {}
  }

  export class ToggleAllItems {
    static readonly type = '[Worker] Toggle All';
    constructor(public selected: boolean) {}
  }
}
