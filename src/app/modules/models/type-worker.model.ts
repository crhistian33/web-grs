import { BaseStateModel } from "@shared/models/base-state.model";
import { BaseModel } from "@shared/models/base.model";

export interface TypeWorker extends BaseModel {
  name: string;
}

export interface TypeWorkerRequest {
  name: string;
}

export interface TypeWorkerStateModel extends BaseStateModel<TypeWorker> {}
