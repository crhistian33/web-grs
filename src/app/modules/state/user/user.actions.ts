import { User } from "@models/user.model";

export namespace UserAction {
  export class GetProfile {
    static readonly type = '[User] Get Profile';
    constructor(public payload: User) {};
  }

  export class ClearAll {
    static readonly type = '[User] Clear item';
  }
}
