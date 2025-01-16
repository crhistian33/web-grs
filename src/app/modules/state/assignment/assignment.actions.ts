import { Assignment } from "@models/assignment.model";
import { FilterStateModel } from "@shared/models/filter.model";

export namespace AssignmentActions {
  export class GetAll {
    static readonly type = '[Assignment] Get All';
  }

  export class GetDeletes {
    static readonly type = '[Assignment] Get All Deletes';
  }

  export class GetAllFilter<T> {
    static readonly type = '[Assignment] Get All Filter';
    constructor(public searchTerm: string, public columns: (keyof T)[]) {}
  }

  export class DropFilter {
    static readonly type = '[Assignment] Drop Filter';
    constructor(public payload: Partial<FilterStateModel>) {}
  }

  export class GetById {
    static readonly type = '[Assignment] Get By Id';
    constructor(public id: number) {}
  }

  export class countDeletes {
    static readonly type = '[Assignment] Count Deletes';
  }

  export class Create {
    static readonly type = '[Assignment] Create';
    constructor(public payload: Assignment) {}
  }

  export class Update {
    static readonly type = '[Assignment] Update';
    constructor(public id: number, public payload: Partial<Assignment>) {}
  }

  export class Delete {
    static readonly type = '[Assignment] Delete';
    constructor(public id: number, public del: boolean) {}
  }

  export class Restore {
    static readonly type = '[Assignment] Restore';
    constructor(public id: number) {}
  }

  export class DeleteAll {
    static readonly type = '[Assignment] Delete All';
    constructor(public payload: Assignment[], public del: boolean) {}
  }

  export class RestoreAll {
    static readonly type = '[Assignment] Restore All';
    constructor(public payload: Assignment[]) {}
  }

  export class ToggleItemSelection {
    static readonly type = '[Assignment] Toggle Selection';
    constructor(public id: number) {}
  }

  export class ToggleAllItems {
    static readonly type = '[Assignment] Toggle All';
    constructor(public selected: boolean) {}
  }
}
