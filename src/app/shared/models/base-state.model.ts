import { BaseModel } from "./base.model";

export interface BaseStateModel<T extends BaseModel> {
  entities: T[];
  entitiesUpload: T[];
  filteredItems: T[];
  trashedItems: T[];
  filterTrashedItems?: T[];
  selectedEntity: T | null;
  searchTerm: string;
  loaded?: boolean;
  result: {
    title: string,
    message: string,
  } | null
}
