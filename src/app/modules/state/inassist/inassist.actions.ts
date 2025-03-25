import { Inassist, InassistRequest } from "@models/inassist.model";
import { FilterStateModel } from "@shared/models/filter.model";

export namespace InassistAction {
  export class GetAll {
    static readonly type = '[Inassist] Get All';
    constructor(public id?: number) {};
  }

  export class GetDaysUnit {
    static readonly type = '[Inassist] Get Days Unit Month';
    constructor(public unit_shift_id: number, public month: number) {}
  }

  export class CreateMany {
    static readonly type = '[Inassist] Create Many';
    constructor(public payload: InassistRequest[]) {}
  }

  export class Filters<T> {
    static readonly type = '[Inassist] Filters Entities';
    constructor(public payload: Partial<FilterStateModel>, public page: string, public columns?: (keyof T)[]) {}
  }

  export class Delete {
    static readonly type = '[Inassist] Delete';
    constructor(public worker_id: number, public month: number) {}
  }

  export class DeleteAll {
    static readonly type = '[Inassist] Delete All';
    constructor(public payload: InassistRequest[]) {}
  }

  export class ClearAll {
    static readonly type = '[Inassist] Clear All';
  }

  export class ToggleItemSelection {
    static readonly type = '[Inassist] Toggle Selection';
    constructor(public id: number, public page: string) {}
  }

  export class ToggleAllItems {
    static readonly type = '[Inassist] Toggle All';
    constructor(public selected: boolean, public page: string) {}
  }

  export class ClearItemSelection {
    static readonly type = '[Inassist] Clear Selection';
  }
}
