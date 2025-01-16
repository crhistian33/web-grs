import { Customer } from "@models/customer.model";
import { FilterStateModel } from "@shared/models/filter.model";

export namespace CustomerActions {
  export class GetAll {
    static readonly type = '[Customer] Get All';
  }

  export class GetDeletes {
    static readonly type = '[Customer] Get All Deletes';
  }

  export class GetAllFilter<T> {
    static readonly type = '[Customer] Get All Filter';
    constructor(public searchTerm: string, public columns: (keyof T)[]) {}
  }

  export class GetById {
    static readonly type = '[Customer] Get By Id';
    constructor(public id: number) {}
  }

  export class countDeletes {
    static readonly type = '[Customer] Count Deletes';
  }

  export class DropFilter {
    static readonly type = '[Customer] Drop Filter';
    constructor(public payload: Partial<FilterStateModel>) {}
  }

  export class Create {
    static readonly type = '[Customer] Create';
    constructor(public payload: Customer) {}
  }

  export class Update {
    static readonly type = '[Customer] Update';
    constructor(public id: number, public payload: Partial<Customer>) {}
  }

  export class Delete {
    static readonly type = '[Customer] Delete';
    constructor(public id: number, public del: boolean) {}
  }

  export class Restore {
    static readonly type = '[Customer] Restore';
    constructor(public id: number) {}
  }

  export class DeleteAll {
    static readonly type = '[Customer] Delete All';
    constructor(public payload: Customer[], public del: boolean) {}
  }

  export class RestoreAll {
    static readonly type = '[Customer] Restore All';
    constructor(public payload: Customer[]) {}
  }

  export class ToggleItemSelection {
    static readonly type = '[Customer] Toggle Selection';
    constructor(public id: number) {}
  }

  export class ToggleAllItems {
    static readonly type = '[Customer] Toggle All';
    constructor(public selected: boolean) {}
  }
}
