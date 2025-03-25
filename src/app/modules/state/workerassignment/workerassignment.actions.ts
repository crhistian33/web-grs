import { WorkerAssignment, WorkerAssignmentRequest } from "@models/workerassignment.model";
import { FilterStateModel } from "@shared/models/filter.model";

export namespace WorkerAssignmentActions {
  export class GetAll {
    static readonly type = '[WorkerAssignment] Get All';
    constructor(public id?: number) {};
  }

  export class GetWorkerToUnit {
    static readonly type = '[WorkerAssignment] Get Worker to Unit';
    constructor(public unit_shift_id: number, public today: string) {};
  }

  export class GetById {
    static readonly type = '[WorkerAssignment] Get By Id';
    constructor(public id: number) {}
  }

  export class Filters<T> {
    static readonly type = '[WorkerAssignment] Filters Entities';
    constructor(public payload: Partial<FilterStateModel>, public page: string, public columns?: (keyof T)[]) {}
  }

  export class Update {
    static readonly type = '[WorkerAssignment] Update';
    constructor(public id: number, public payload: Partial<WorkerAssignmentRequest>) {}
  }

  export class Delete {
    static readonly type = '[WorkerAssignment] Delete';
    constructor(public id: number, public del: boolean, public page: string) {}
  }

  export class DeleteAll {
    static readonly type = '[WorkerAssignment] Delete All';
    constructor(public payload: WorkerAssignment[], public del: boolean, public active: boolean) {}
  }

  export class ToggleItemSelection {
    static readonly type = '[WorkerAssignment] Toggle Selection';
    constructor(public id: number, public page: string) {}
  }

  export class ToggleAllItems {
    static readonly type = '[WorkerAssignment] Toggle All';
    constructor(public selected: boolean, public page: string) {}
  }

  export class ClearItemSelection {
    static readonly type = '[WorkerAssignment] Clear Selection';
  }

  export class clearAll {
    static readonly type = '[WorkerAssignment] Clear All';
  }
}
