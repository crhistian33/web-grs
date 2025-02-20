import { BaseModel } from "@shared/models/base.model";
import { Role } from "./role.model";
import { Company } from "./company.model";
import { BaseStateModel } from "@shared/models/base-state.model";

export interface User extends BaseModel {
  name: string;
  email: string;
  role: Role;
  companies: Company[];
}

export interface UserRequest {
  name: string;
  email: string;
  role_id: number;
}

export interface UserStateModel extends BaseStateModel<User> {}
