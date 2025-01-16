export interface Breadcrumb {
  label: string;
  url: string;
}

export interface BreadcrumbStateModel {
  breadcrumbs: Breadcrumb[];
}
