import { BaseModel } from "@shared/models/base.model";
import { BaseStateModel } from "@shared/models/base-state.model";

export interface Company extends BaseModel {
  code: string;
  name: string;
}

export interface CompanyRequest {
  code: string;
  name: string;
}

export interface CompanyStateModel extends BaseStateModel<Company> {}
