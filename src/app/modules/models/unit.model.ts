import { BaseStateModel } from "@shared/models/base-state.model";
import { BaseModel } from "@shared/models/base.model";
import { Center } from "./center.model";
import { Customer } from "./customer.model";
import { Shift } from "./shift.model";

export interface Unit extends BaseModel {
  code: string;
  name: string;
  center: Center;
  customer: Customer;
  min_assign: number;
  shifts: Shift[];
}

export interface UnitRequest {
  code: string;
  name: string;
  center_id: number;
  customer_id: number;
  min_assign: number;
  shifts: Shift[];
}

export interface UnitStateModel extends BaseStateModel<Unit> {}
