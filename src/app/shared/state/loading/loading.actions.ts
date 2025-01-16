export class SetLoading {
  static readonly type = '[Loading] Set Loading State';
  constructor(
    public actionType: string,
    public isLoading: boolean
  ) {}
}
