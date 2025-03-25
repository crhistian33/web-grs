import { BaseStateModel } from "@shared/models/base-state.model";
import { BaseModel } from "@shared/models/base.model";
import { WorkerAssignment } from "./workerassignment.model";
import { Worker } from "./worker.model";
import { StateWork } from "./state.model";
import { Assignment } from "./assignment.model";
import { Company } from "./company.model";
import { UnitShift } from "./unitshift.model";

export interface Assist extends BaseModel {
  //worker: Worker;
  name: string;
  dni: string;
  unitshift: UnitShift;
  //assignment: Assignment;
  days: Day[];
}

export interface Day {
  key: string;
  day: number;
  month: number;
  state: StateWork;
  inassist_id: number;
}

export interface AssistRequest {
  assist_date: string;
  unit_shift_id: number;
  worker_assignments: WorkerAssignment[];
}

export interface AssistForm {
  date_from: string;
  date_to: string;
  company_id?: number;
}

export interface AssistStateModel extends BaseStateModel<Assist> {}
