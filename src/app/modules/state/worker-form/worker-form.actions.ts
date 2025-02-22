import { WorkerForm } from "@models/worker.model";

export namespace WorkerFormAction {
  export class GetUnassigns {
    static readonly type = '[WorkerForm] Get Unassigns';
    constructor(public payload?: WorkerForm) {};
  }

  export class ToggleItemSelection {
    static readonly type = '[WorkerForm] Toggle Selection';
    constructor(public id: number, public page: string) {}
  }

  export class ToggleAllItems {
    static readonly type = '[WorkerForm] Toggle All';
    constructor(public selected: boolean, public page: string) {}
  }

  export class ClearItemSelection {
    static readonly type = '[WorkerForm] Clear Selection';
  }

  export class clearAll {
    static readonly type = '[WorkerForm] Clear All';
  }
}
