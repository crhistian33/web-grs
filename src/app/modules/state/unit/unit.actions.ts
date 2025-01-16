import { Unit } from '@models/unit.model';
import { FilterStateModel } from '@shared/models/filter.model';

export namespace UnitActions {
  export class GetAll {
    static readonly type = '[Unit] Get All';
  }

  export class GetDeletes {
    static readonly type = '[Unit] Get All Deletes';
  }

  export class GetAllFilter<T> {
    static readonly type = '[Unit] Get All Filter';
    constructor(public searchTerm: string, public columns: (keyof T)[]) {}
  }

  export class GetAllToShift {
    static readonly type = '[Unit] Get All to Shift';
  }

  export class GetById {
    static readonly type = '[Unit] Get By Id';
    constructor(public id: number) {}
  }

  export class countDeletes {
    static readonly type = '[Unit] Count Deletes';
  }

  export class DropFilter {
    static readonly type = '[Unit] Drop Filter';
    constructor(public payload: Partial<FilterStateModel>) {}
  }

  export class Create {
    static readonly type = '[Unit] Create';
    constructor(public payload: Unit) {}
  }

  export class Update {
    static readonly type = '[Unit] Update';
    constructor(public id: number, public payload: Partial<Unit>) {}
  }

  export class Delete {
    static readonly type = '[Unit] Delete';
    constructor(public id: number, public del: boolean) {}
  }

  export class Restore {
    static readonly type = '[Unit] Restore';
    constructor(public id: number) {}
  }

  export class DeleteAll {
    static readonly type = '[Unit] Delete All';
    constructor(public payload: Unit[], public del: boolean) {}
  }

  export class RestoreAll {
    static readonly type = '[Unit] Restore All';
    constructor(public payload: Unit[]) {}
  }

  export class ToggleItemSelection {
    static readonly type = '[Unit] Toggle Selection';
    constructor(public id: number) {}
  }

  export class ToggleAllItems {
    static readonly type = '[Unit] Toggle All';
    constructor(public selected: boolean) {}
  }
}
