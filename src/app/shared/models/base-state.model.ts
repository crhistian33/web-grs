import { BaseModel } from "./base.model";

export interface BaseStateModel<T extends BaseModel> {
  entities: T[];
  filteredItems: T[];
  trashedItems: T[];
  filterTrashedItems: T[];
  assigns?: T[];
  unitshiftId?: number;
  days?: any[];
  selectedEntity: T | null;
  searchTerm: string;
  loaded?: boolean;
  result: {
    title: string,
    message: string,
  } | null
}
