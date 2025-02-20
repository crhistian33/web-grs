import { Worker, WorkerRequest } from "@models/worker.model";
import { FilterStateModel } from "@shared/models/filter.model";

export namespace WorkerActions {
  export class GetAll {
    static readonly type = '[Worker] Get All';
    constructor(public id?: number) {};
  }

  export class GetTrasheds {
    static readonly type = '[Worker] Get All Trasheds';
    constructor(public id?: number) {};
  }

  export class GetUnassignment {
    static readonly type = '[Worker] Get All Unassignment';
    constructor(public id?: number) {};
  }

  export class GetTitulars {
    static readonly type = '[Worker] Get All Titulars';
  }

  export class GetById {
    static readonly type = '[Worker] Get By Id';
    constructor(public id: number) {}
  }

  export class Filters<T> {
    static readonly type = '[Worker] Filters Entities';
    constructor(public payload: Partial<FilterStateModel>, public page: string, public columns?: (keyof T)[]) {}
  }

  export class Create {
    static readonly type = '[Worker] Create';
    constructor(public payload: WorkerRequest) {}
  }

  export class Update {
    static readonly type = '[Worker] Update';
    constructor(public id: number, public payload: Partial<WorkerRequest>) {}
  }

  export class Delete {
    static readonly type = '[Worker] Delete';
    constructor(public id: number, public del: boolean, public page: string) {}
  }

  export class Restore {
    static readonly type = '[Worker] Restore';
    constructor(public id: number) {}
  }

  export class DeleteAll {
    static readonly type = '[Worker] Delete All';
    constructor(public payload: Worker[], public del: boolean, public active: boolean, public page: string, public id?: number) {}
  }

  export class RestoreAll {
    static readonly type = '[Worker] Restore All';
    constructor(public payload: Worker[]) {}
  }

  export class ToggleItemSelection {
    static readonly type = '[Worker] Toggle Selection';
    constructor(public id: number, public page: string) {}
  }

  export class ToggleAllItems {
    static readonly type = '[Worker] Toggle All';
    constructor(public selected: boolean, public page: string) {}
  }

  export class ClearItemSelection {
    static readonly type = '[Worker] Clear Selection';
  }

  export class clearEntity {
    static readonly type = '[Worker] Clear entity';
  }

  export class clearAll {
    static readonly type = '[Worker] Clear All';
  }


}
