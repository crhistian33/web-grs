import { Unit, UnitRequest } from '@models/unit.model';
import { FilterStateModel } from '@shared/models/filter.model';

export namespace UnitActions {
  export class GetAll {
    static readonly type = '[Unit] Get All';
    constructor(public id?: number) {};
  }

  export class GetTrasheds {
    static readonly type = '[Unit] Get All Trasheds';
    constructor(public id?: number) {};
  }

  export class GetAllToShift {
    static readonly type = '[Unit] Get All to Shift';
  }

  export class GetById {
    static readonly type = '[Unit] Get By Id';
    constructor(public id: number) {}
  }

  export class Filters<T> {
    static readonly type = '[Unit] Filters Entities';
    constructor(public payload: Partial<FilterStateModel>, public page: string, public columns?: (keyof T)[]) {}
  }

  export class Create {
    static readonly type = '[Unit] Create';
    constructor(public payload: UnitRequest) {}
  }

  export class Update {
    static readonly type = '[Unit] Update';
    constructor(public id: number, public payload: Partial<UnitRequest>) {}
  }

  export class Delete {
    static readonly type = '[Unit] Delete';
    constructor(public id: number, public del: boolean, public page: string) {}
  }

  export class Restore {
    static readonly type = '[Unit] Restore';
    constructor(public id: number) {}
  }

  export class DeleteAll {
    static readonly type = '[Unit] Delete All';
    constructor(public payload: Unit[], public del: boolean,public active: boolean, public page: string, public id?: number) {}
  }

  export class RestoreAll {
    static readonly type = '[Unit] Restore All';
    constructor(public payload: Unit[]) {}
  }

  export class ToggleItemSelection {
    static readonly type = '[Unit] Toggle Selection';
    constructor(public id: number, public page: string) {}
  }

  export class ToggleAllItems {
    static readonly type = '[Unit] Toggle All';
    constructor(public selected: boolean, public page: string) {}
  }

  export class ClearItemSelection {
    static readonly type = '[Unit] Clear Selection';
  }

  export class clearEntity {
    static readonly type = '[Unit] Clear entity';
  }

  export class clearAll {
    static readonly type = '[Unit] Clear All';
  }
}
