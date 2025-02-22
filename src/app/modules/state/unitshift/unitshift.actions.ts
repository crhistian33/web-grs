export namespace UnitShiftActions {
  export class GetAll {
    static readonly type = '[UnitShift] Get All';
    constructor(public id?: number) {};
  }

  export class clearAll {
    static readonly type = '[UnitShift] Clear All';
  }
}
