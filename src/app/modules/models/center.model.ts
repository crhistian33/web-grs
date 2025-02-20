import { BaseStateModel } from "@shared/models/base-state.model";
import { BaseModel } from "@shared/models/base.model";

export interface Center extends BaseModel {
  code: string;
  name: string;
  mount: number;
}

export interface CenterRequest {
  code: string;
  name: string;
  mount: number;
}

export interface CenterStateModel extends BaseStateModel<Center> {}
