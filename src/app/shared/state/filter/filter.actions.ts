import { FilterStateModel } from "@shared/models/filter.model";

export namespace FilterActions {
  export class SelectCompany {
    static readonly type = '[Filter] Select Company';
    constructor(public companyId: number) {}
  }

  export class SelectCustomer {
    static readonly type = '[Filter] Select Customer';
    constructor(public customerId: number) {}
  }

  export class SelectUnit {
    static readonly type = '[Filter] Select Unit';
    constructor(public unitId: number) {}
  }

  export class SelectShift {
    static readonly type = '[Filter] Select Shift';
    constructor(public shiftId: number) {}
  }

  export class SelectTypeWorker {
    static readonly type = '[Filter] Select TypeWorker';
    constructor(public typeworkerId: number) {}
  }

  export class SelectCenter {
    static readonly type = '[Filter] Select Center';
    constructor(public centerId: number) {}
  }

  export class updateFilters {
    static readonly type = '[Filter] Update Filters';
    constructor(public payload: Partial<FilterStateModel>) {}
  }
}
