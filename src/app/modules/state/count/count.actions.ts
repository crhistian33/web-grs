export namespace CountActions {
  export class GetCounts {
    static readonly type = '[Counts] Fetch counts';
  }

  export class GetCountsByCompany {
    static readonly type = '[Counts] Fetch counts by company';
    constructor(public id: number) {};
  }

  export class ClearCounts {
    static readonly type = '[Counts] Clear counts';
  }
}
