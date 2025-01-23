import { BaseModel } from "@shared/models/base.model";
import { TypeWorker } from "./type-worker.model";
import { BaseStateModel } from "@shared/models/base-state.model";
import { Assignment } from "./assignment.model";

export interface Worker extends BaseModel {
  name: string;
  dni: string;
  birth_date: string;
  typeworker: TypeWorker;
  assignments: Assignment[];
}

export interface WorkerStateModel extends BaseStateModel<Worker> {}
