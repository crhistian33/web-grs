export namespace CountActions {
  export class GetCounts {
    static readonly type = '[Counts] Fetch counts';
  }

  export class ClearCounts {
    static readonly type = '[Counts] Clear counts';
  }
}
