export interface FilterStateModel {
  companyId?: number | null;
  customerId?: number | null;
  unitId?: number | null;
  shiftId?: number | null;
  typeworkerId?: number | null;
  centerId?: number | null;
  searchTerm?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
}
