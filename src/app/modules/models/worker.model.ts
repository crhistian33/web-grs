import { BaseModel } from "@shared/models/base.model";
import { TypeWorker } from "./type-worker.model";
import { BaseStateModel } from "@shared/models/base-state.model";
import { Assignment } from "./assignment.model";
import { Company } from "./company.model";

export interface Worker extends BaseModel {
  name: string;
  dni: string;
  birth_date: string;
  typeworker: TypeWorker;
  company: Company;
  assignments: Assignment[];
}

export interface WorkerRequest {
  name: string;
  dni: string;
  birth_date: string;
  company_id: number;
  type_worker_id: number;
  user_id: number;
}

export interface WorkerForm {
  assignment_id?: number;
  company_id?: number;
}

export interface WorkerUpload {
  name: string;
  dni: string;
  birth_date: string;
  company_id: number;
  type_worker_id: number;
  user_id: number;
}

export interface WorkerStateModel extends BaseStateModel<Worker> {}
