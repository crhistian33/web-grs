import { BaseStateModel } from "@shared/models/base-state.model";
import { BaseModel } from "@shared/models/base.model";
import { UnitShift } from "./unitshift.model";
import { Worker } from "./worker.model";

export interface Inassist extends BaseModel {
  worker: Worker;
  month: number;
  days: string;
  unitshift: UnitShift;
}

export interface InassistDays {
  worker_id: number;
  state: string;
  start_date: string;
  month: number;
}

export interface InassistRequest {
  worker_id: number;
  state?: string;
  start_date?: string;
  month: number;
}

export interface InassistStateModel extends BaseStateModel<Inassist> {}
