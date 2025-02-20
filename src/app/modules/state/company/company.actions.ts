import { Company, CompanyRequest } from "@models/company.model";
import { FilterStateModel } from "@shared/models/filter.model";

export namespace CompanyActions {
  export class GetAll {
    static readonly type = '[Company] Get All';
  }

  export class GetTrasheds {
    static readonly type = '[Company] Get All Trasheds';
  }

  export class GetById {
    static readonly type = '[Company] Get By Id';
    constructor(public id: number) {}
  }

  export class Filters<T> {
    static readonly type = '[Company] Filters Entities';
    constructor(public payload: Partial<FilterStateModel>, public page: string, public columns?: (keyof T)[]) {}
  }

  export class Create {
    static readonly type = '[Company] Create';
    constructor(public payload: CompanyRequest) {}
  }

  export class Update {
    static readonly type = '[Company] Update';
    constructor(public id: number, public payload: Partial<CompanyRequest>) {}
  }

  export class Delete {
    static readonly type = '[Company] Delete';
    constructor(public id: number, public del: boolean, public page: string) {}
  }

  export class Restore {
    static readonly type = '[Company] Restore';
    constructor(public id: number) {}
  }

  export class DeleteAll {
    static readonly type = '[Company] Delete All';
    constructor(public payload: Company[], public del: boolean, public active: boolean, public page: string) {}
  }

  export class RestoreAll {
    static readonly type = '[Company] Restore All';
    constructor(public payload: Company[]) {}
  }

  export class ToggleItemSelection {
    static readonly type = '[Company] Toggle Selection';
    constructor(public id: number, public page: string) {}
  }

  export class ToggleAllItems {
    static readonly type = '[Company] Toggle All';
    constructor(public selected: boolean, public page: string) {}
  }

  export class ClearItemSelection {
    static readonly type = '[Company] Clear Selection';
  }

  export class clearEntity {
    static readonly type = '[Company] Clear entity';
  }

  export class clearAll {
    static readonly type = '[Company] Clear All';
  }
}
