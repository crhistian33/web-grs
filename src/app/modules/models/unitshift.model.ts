import { BaseModel } from "@shared/models/base.model";
import { Unit } from "./unit.model";
import { Shift } from "./shift.model";
import { BaseStateModel } from "@shared/models/base-state.model";
import { Assignment } from "./assignment.model";

export interface UnitShift extends BaseModel {
  name: string;
  unit: Unit;
  shift: Shift;
  assignments: Assignment[];
}

export interface UnitshiftStateModel extends BaseStateModel<UnitShift> {}
