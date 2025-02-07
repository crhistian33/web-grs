export namespace AuthAction {
  export class Login {
    static readonly type = '[Auth] Login';
    constructor(readonly email: string, readonly password: string) { }
  }

  export class Refresh {
    static readonly type = '[Auth] Refresh token';
  }

  export class Logout {
    static readonly type = '[Auth] Logout';
  }
}
