import { BaseModel } from "../models/base.model";

export interface StateType<T extends BaseModel> {
  entities: { [key: string]: T };
  ids: (string | number)[];
  selected: T | null;
  loading: boolean;
  error: string | null;
}
