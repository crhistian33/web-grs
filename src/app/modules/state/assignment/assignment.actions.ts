import { Assignment, AssignmentRequest } from "@models/assignment.model";
import { FilterStateModel } from "@shared/models/filter.model";

export namespace AssignmentActions {
  export class GetAll {
    static readonly type = '[Assignment] Get All';
    constructor(public id?: number) {};
  }

  export class GetWorkerAssigns {
    static readonly type = '[Assignment] Get Workers assigns';
  }

  export class GetUnitToShift {
    static readonly type = '[Assignment] Get Unit to Shift';
  }

  export class GetById {
    static readonly type = '[Assignment] Get By Id';
    constructor(public id: number) {}
  }

  export class Filters<T> {
    static readonly type = '[Assignment] Filters Entities';
    constructor(public payload: Partial<FilterStateModel>, public page: string, public columns?: (keyof T)[]) {}
  }

  export class Create {
    static readonly type = '[Assignment] Create';
    constructor(public payload: AssignmentRequest) {}
  }

  export class Update {
    static readonly type = '[Assignment] Update';
    constructor(public id: number, public payload: Partial<AssignmentRequest>) {}
  }

  export class Desactivate {
    static readonly type = '[Assignment] Desactivate';
    constructor(public id: number) {}
  }

  export class Delete {
    static readonly type = '[Assignment] Delete';
    constructor(public id: number, public del: boolean, public page: string) {}
  }

  export class DeleteAll {
    static readonly type = '[Assignment] Delete All';
    constructor(public payload: Assignment[], public del: boolean, public active: boolean, public page: string) {}
  }

  export class ToggleItemSelection {
    static readonly type = '[Assignment] Toggle Selection';
    constructor(public id: number, public page: string) {}
  }

  export class ToggleAllItems {
    static readonly type = '[Assignment] Toggle All';
    constructor(public selected: boolean, public page: string) {}
  }

  export class ClearItemSelection {
    static readonly type = '[Assignment] Clear Selection';
  }

  export class clearEntity {
    static readonly type = '[Assignment] Clear entity';
  }

  export class clearAll {
    static readonly type = '[Assignment] Clear All';
  }

  export class verifiedUnitShift {
    static readonly type = '[Assignment] Verified Unit Shift';
    constructor(public id: number) {}
  }
}
