import { BaseStateModel } from "@shared/models/base-state.model";
import { BaseModel } from "@shared/models/base.model";
import { Company } from "./company.model";

export interface Customer extends BaseModel {
  code: string;
  name: string;
  ruc: string;
  phone: string;
  company: Company;
}

export interface CustomerStateModel extends BaseStateModel<Customer> {}
