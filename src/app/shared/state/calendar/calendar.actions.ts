export namespace CalendarAction {
  export class SelectItem {
    static readonly type = '[Calendar] Select Item';
    constructor(public id: number) {}
  }

  export class ToggleDaySelection {
    static readonly type = '[Calendar] Toggle Day Selection';
    constructor(public date: string) {}
  }

  export class ClearCalendar {
    static readonly type = '[Calendar] Clear calendar';
  }
}
