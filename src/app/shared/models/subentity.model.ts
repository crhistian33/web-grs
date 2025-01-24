import { Observable } from "rxjs";

export interface SubEntity {
  id: string;
  data: Observable<any>;
  type: string;
  columns?: any
}
