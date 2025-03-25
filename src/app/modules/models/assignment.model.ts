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
  unitshift: UnitShift;
  workers_count: number;
  workers: Worker[];
}

export interface AssignmentRequest {
  start_date: string;
  end_date: string;
  state: boolean;
  unit_shift_id: number;
}

export interface AssignmentWorker {
  assignment_id: number;
  workers: {
    id: number;
    worker_assignment_id: number;

  }
}

export interface AssignmentStateModel extends BaseStateModel<Assignment> {}
