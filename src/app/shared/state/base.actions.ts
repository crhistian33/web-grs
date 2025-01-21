export class BaseActions<T> {
  constructor(private readonly context: string) {}

  GetAll() {
    return {
      type: `[${this.context}] Get All`
    };
  }
}
