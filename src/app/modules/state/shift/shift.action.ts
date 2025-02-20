import { Shift } from "@models/shift.model";
import { FilterStateModel } from "@shared/models/filter.model";

export namespace ShiftActions {
  export class GetAll {
    static readonly type = '[Shift] Get All';
  }

  export class GetTrasheds {
    static readonly type = '[Shift] Get All Trasheds';
  }

  export class GetById {
    static readonly type = '[Shift] Get By Id';
    constructor(public id: number) {}
  }

  export class Filters<T> {
    static readonly type = '[Shift] Filters Entities';
    constructor(public payload: Partial<FilterStateModel>, public page: string, public columns?: (keyof T)[]) {}
  }

  export class Create {
    static readonly type = '[Shift] Create';
    constructor(public payload: Shift) {}
  }

  export class Update {
    static readonly type = '[Shift] Update';
    constructor(public id: number, public payload: Partial<Shift>) {}
  }

  export class Delete {
    static readonly type = '[Shift] Delete';
    constructor(public id: number, public del: boolean, public page: string) {}
  }

  export class Restore {
    static readonly type = '[Shift] Restore';
    constructor(public id: number) {}
  }

  export class DeleteAll {
    static readonly type = '[Shift] Delete All';
    constructor(public payload: Shift[], public del: boolean, public active: boolean, public page: string) {}
  }

  export class RestoreAll {
    static readonly type = '[Shift] Restore All';
    constructor(public payload: Shift[]) {}
  }

  export class ToggleItemSelection {
    static readonly type = '[Shift] Toggle Selection';
    constructor(public id: number, public page: string) {}
  }

  export class ToggleAllItems {
    static readonly type = '[Shift] Toggle All';
    constructor(public selected: boolean, public page: string) {}
  }

  export class ClearItemSelection {
    static readonly type = '[Shift] Clear Selection';
  }

  export class clearEntity {
    static readonly type = '[Shift] Clear entity';
  }

  export class clearAll {
    static readonly type = '[Shift] Clear All';
  }
}
