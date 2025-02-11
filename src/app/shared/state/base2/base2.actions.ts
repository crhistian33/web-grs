import { FilterStateModel } from "@shared/models/filter.model";

export namespace BaseActions {
  export class GetAll {
    static readonly type = '[Base] Get All';
  }

  export class GetByCompany {
    static readonly type = '[Base] Get All Company';
    constructor(public id: number) {};
  }

  export class GetDeletes {
    static readonly type = '[Base] Get All Deletes';
  }

  export class GetDeletesByCompany {
    static readonly type = '[Base] Get All Deletes by Company';
    constructor(public id: number) {};
  }

  export class GetById {
    static readonly type = '[Base] Get By Id';
    constructor(public id: number) {}
  }

  export class countDeletes {
    static readonly type = '[Base] Count Deletes';
  }

  export class Filters<T> {
    static readonly type = '[Base] Filters Entities';
    constructor(public payload: Partial<FilterStateModel>, public page: string, public columns?: (keyof T)[]) {}
  }

  export class Create {
    static readonly type = '[Base] Create';
    constructor(public payload: any) {}
  }

  export class Update {
    static readonly type = '[Base] Update';
    constructor(public id: number, public payload: Partial<any>) {}
  }

  export class Delete {
    static readonly type = '[Base] Delete';
    constructor(public id: number, public del: boolean, public page: string) {}
  }

  export class Restore {
    static readonly type = '[Base] Restore';
    constructor(public id: number) {}
  }

  export class DeleteAll<T> {
    static readonly type = '[Base] Delete All';
    constructor(public payload: T[], public del: boolean, public active: boolean, public page: string) {}
  }

  export class RestoreAll<T> {
    static readonly type = '[Base] Restore All';
    constructor(public payload: T[]) {}
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
