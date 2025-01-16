import { BaseModel } from "./base.model";

export interface BaseStateModel<T extends BaseModel> {
  entities: T[];
  filteredItems: T[];
  trashedItems: T[];
  selectedEntity: T | null;
  searchTerm: string;
  result: {
    title: string,
    message: string,
  } | null
}
