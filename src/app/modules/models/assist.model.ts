import { BaseStateModel } from "@shared/models/base-state.model";
import { BaseModel } from "@shared/models/base.model";
import { WorkerAssignment } from "./workerassignment.model";
import { UnitShift } from "./unitshift.model";

export interface AssistRequest {
  assist_date: string;
  unit_shift_id: number;
  worker_assignments: WorkerAssignment[];
}

export interface Assist extends BaseModel {
  start_date: string;
  unitshift: UnitShift;
  worker_assignments: WorkerAssignment[];
  total_attended: number;
  total_absent: number;
}

export interface AssistStateModel extends BaseStateModel<Assist> {}
