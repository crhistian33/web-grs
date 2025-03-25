import { BaseStateModel } from "@shared/models/base-state.model";
import { BaseModel } from "@shared/models/base.model";

export interface StateWork extends BaseModel {
  name: string;
  shortName: string;
  type: boolean;
}

export interface StateWorkRequest {
  name: string;
  shortName: string;
  type: boolean;
}

export interface StateWorkStateModel extends BaseStateModel<StateWork> {}
