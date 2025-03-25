import { Assist, AssistForm } from "@models/assist.model";
import { FilterStateModel } from "@shared/models/filter.model";

export namespace AssistActions {
  export class GetAll {
    static readonly type = '[Assist] Get All';
    constructor(public payload: AssistForm) {}
  }

  export class GetAllBreaks {
    static readonly type = '[Assist] Get All Breaks';
    constructor(public payload: AssistForm) {}
  }

  export class GetAssistDay {
    static readonly type = '[Assist] Get Assist Day';
    constructor(public id: number, public date: string) {}
  }

  export class GetById {
    static readonly type = '[Assist] Get By Id';
    constructor(public id: number) {}
  }

  export class Filters<T> {
    static readonly type = '[Assist] Filters Entities';
    constructor(public payload: Partial<FilterStateModel>, public page: string, public columns?: (keyof T)[]) {}
  }

  export class Create {
    static readonly type = '[Assist] Create';
    constructor(public payload: Assist) {}
  }

  export class Update {
    static readonly type = '[Assist] Update';
    constructor(public id: number, public payload: Partial<Assist>) {}
  }

  export class Delete {
    static readonly type = '[Assist] Delete';
    constructor(public id: number, public del: boolean) {}
  }

  export class DeleteAll {
    static readonly type = '[Assist] Delete All';
    constructor(public payload: Assist[], public del: boolean, public active: boolean) {}
  }

  export class ToggleItemSelection {
    static readonly type = '[Assist] Toggle Selection';
    constructor(public id: number) {}
  }

  export class ToggleAllItems {
    static readonly type = '[Assist] Toggle All';
    constructor(public selected: boolean) {}
  }

  export class ClearItemSelection {
    static readonly type = '[Assist] Clear Selection';
  }

  export class clearEntity {
    static readonly type = '[Assist] Clear entity';
  }

  export class clearAll {
    static readonly type = '[Assist] Clear All';
  }
}
