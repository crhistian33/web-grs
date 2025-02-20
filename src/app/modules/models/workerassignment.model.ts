import { BaseModel } from "@shared/models/base.model";
import { Worker } from "./worker.model";
import { Assignment } from "./assignment.model";
import { BaseStateModel } from "@shared/models/base-state.model";

export interface WorkerAssignment extends BaseModel {
  worker: Worker;
  assignment: Assignment;
}

export interface WorkerAssignmentRequest {
  worker_id: number;
  assignment_id: number;
}

export interface WorkerassignmentStateModel extends BaseStateModel<WorkerAssignment> {}
