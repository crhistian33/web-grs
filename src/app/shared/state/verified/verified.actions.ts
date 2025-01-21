export namespace VerifiedAction {
  export class IfAssign {
    static readonly type = '[Verified] If Assign';
    constructor(public id: number, public assign_id?: number) { }
  }
}
