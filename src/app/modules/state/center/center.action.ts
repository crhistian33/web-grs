import { Center } from "@models/center.model";
import { FilterStateModel } from "@shared/models/filter.model";

export namespace CenterActions {
  export class GetAll {
    static readonly type = '[Center] Get All';
  }

  export class GetDeletes {
    static readonly type = '[Center] Get All Deletes';
  }

  export class GetById {
    static readonly type = '[Center] Get By Id';
    constructor(public id: number) {}
  }

  export class countDeletes {
    static readonly type = '[Center] Count Deletes';
  }

  export class Filters<T> {
    static readonly type = '[Center] Filters Entities';
    constructor(public payload: Partial<FilterStateModel>, public columns?: (keyof T)[]) {}
  }

  export class Create {
    static readonly type = '[Center] Create';
    constructor(public payload: Center) {}
  }

  export class Update {
    static readonly type = '[Center] Update';
    constructor(public id: number, public payload: Partial<Center>) {}
  }

  export class Delete {
    static readonly type = '[Center] Delete';
    constructor(public id: number, public del: boolean) {}
  }

  export class Restore {
    static readonly type = '[Center] Restore';
    constructor(public id: number) {}
  }

  export class DeleteAll {
    static readonly type = '[Center] Delete All';
    constructor(public payload: Center[], public del: boolean, public active: boolean) {}
  }

  export class RestoreAll {
    static readonly type = '[Center] Restore All';
    constructor(public payload: Center[]) {}
  }

  export class ToggleItemSelection {
    static readonly type = '[Center] Toggle Selection';
    constructor(public id: number) {}
  }

  export class ToggleAllItems {
    static readonly type = '[Center] Toggle All';
    constructor(public selected: boolean) {}
  }

  export class ClearItemSelection {
    static readonly type = '[Center] Clear Selection';
  }

  export class clearEntity {
    static readonly type = '[Center] Clear entity';
  }

  export class clearAll {
    static readonly type = '[Center] Clear All';
  }
}
