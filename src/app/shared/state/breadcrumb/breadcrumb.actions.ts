import { Breadcrumb } from "@shared/models/breadcrumb.model";

export class UpdateBreadcrumbs {
  static readonly type = '[Breadcrumb] Update';
  constructor(public breadcrumbs: Breadcrumb[]) {}
}
