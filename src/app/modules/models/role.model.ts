import { BaseModel } from "@shared/models/base.model";

export interface Role extends BaseModel {
  name: string;
  description: string;
}
