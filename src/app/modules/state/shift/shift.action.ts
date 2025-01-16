import { Shift } from "@models/shift.model";

export namespace ShiftActions {
  export class GetAll {
    static readonly type = '[Shift] Get All';
  }

  export class GetDeletes {
    static readonly type = '[Shift] Get All Deletes';
  }

  export class GetAllFilter<T> {
    static readonly type = '[Shift] Get All Filter';
    constructor(public searchTerm: string, public columns: (keyof T)[]) {}
  }

  export class GetById {
    static readonly type = '[Shift] Get By Id';
    constructor(public id: number) {}
  }

  export class countDeletes {
    static readonly type = '[Shift] Count Deletes';
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
    constructor(public id: number, public del: boolean) {}
  }

  export class Restore {
    static readonly type = '[Shift] Restore';
    constructor(public id: number) {}
  }

  export class DeleteAll {
    static readonly type = '[Shift] Delete All';
    constructor(public payload: Shift[], public del: boolean) {}
  }

  export class RestoreAll {
    static readonly type = '[Shift] Restore All';
    constructor(public payload: Shift[]) {}
  }

  export class ToggleItemSelection {
    static readonly type = '[Shift] Toggle Selection';
    constructor(public id: number) {}
  }

  export class ToggleAllItems {
    static readonly type = '[Shift] Toggle All';
    constructor(public selected: boolean) {}
  }
}
