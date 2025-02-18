import { BaseStateModel } from "@shared/models/base-state.model";
import { BaseModel } from "@shared/models/base.model";
import { Unit } from "./unit.model";
import { Shift } from "./shift.model";
import { Worker } from "./worker.model";
import { UnitShift } from "./unitshift.model";

export interface Assignment extends BaseModel {
  start_date: string;
  end_date: string;
  state: boolean;
  // unit: Unit;
  // shift: Shift;
  //unit_shift_id?: number;
  unitshift: UnitShift;
  workers_count: number;
  workers: Worker[];
}

export interface AssignmentStateModel extends BaseStateModel<Assignment> {}
