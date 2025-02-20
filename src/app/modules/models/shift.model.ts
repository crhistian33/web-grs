import { BaseStateModel } from "@shared/models/base-state.model";
import { BaseModel } from "@shared/models/base.model";

export interface Shift extends BaseModel {
  name: string;
  shortName: string;
}

export interface ShiftRequest {
  name: string;
  shortName: string;
}

export interface ShiftStateModel extends BaseStateModel<Shift> {}
