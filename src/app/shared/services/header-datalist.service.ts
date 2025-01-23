import { Injectable } from '@angular/core';
import { Assignment } from '@models/assignment.model';
import { Center } from '@models/center.model';
import { Company } from '@models/company.model';
import { Customer } from '@models/customer.model';
import { Shift } from '@models/shift.model';
import { TypeWorker } from '@models/type-worker.model';
import { Unit } from '@models/unit.model';
import { Worker } from '@models/worker.model';
import { WorkerAssignment } from '@models/workerassignment.model';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { PARAMETERS } from '@shared/utils/constants';

@Injectable({
  providedIn: 'root'
})
export class HeaderDatalistService {
  private headWorker: DataListColumn<Worker>[] = [
    { key: 'id', label: 'N°', type: 'number', filtered: false, internal: false },
    { key: 'name', label: 'Nombres y apellidos', type: 'text', filtered: true, internal: true },
    { key: 'dni', label: 'DNI', type: 'text', filtered: true, internal: true },
    { key: 'birth_date', label: 'Fecha Nac.', type: 'date', filtered: false, internal: false },
    { key: 'typeworker', label: 'Tipo', type: 'relation-name', filtered: false, internal: false },
  ];
  private headWorkerAssign: DataListColumn<WorkerAssignment>[] = [
    { key: 'id', label: 'N°', type: 'number', filtered: false, internal: false },
    { key: 'worker', label: 'Nombres y apellidos', type: 'relation-name', filtered: true, internal: true },
    { key: 'worker', label: 'DNI', type: 'relation-dni', filtered: true, internal: true },
    { key: 'assignment', label: 'Unidad asignada', type: 'relations-unit', filtered: true, internal: false },
    { key: 'assignment', label: 'Turno asignado', type: 'relations-shift', filtered: true, internal: false },
  ];
  private headTypeWorker: DataListColumn<TypeWorker>[] = [
    { key: 'id', label: 'N°', type: 'number', filtered: false, },
    { key: 'name', label: 'Título', type: 'text', filtered: true, },
  ];
  private headCenter: DataListColumn<Center>[] = [
    { key: 'id', label: 'N°', type: 'number', filtered: false, },
    { key: 'code', label: 'Código', type: 'text', filtered: true, },
    { key: 'name', label: 'Título', type: 'text', filtered: true, },
    { key: 'mount', label: 'Monto', type: 'text', filtered: true, },
  ];
  private headCompany: DataListColumn<Company>[] = [
    { key: 'id', label: 'N°', type: 'number', filtered: false, },
    { key: 'code', label: 'Código', type: 'text', filtered: true, },
    { key: 'name', label: 'Título', type: 'text', filtered: true, },
  ];
  private headCustomer: DataListColumn<Customer>[] = [
    { key: 'id', label: 'N°', type: 'number', filtered: false, },
    { key: 'code', label: 'Código', type: 'text', filtered: true, },
    { key: 'name', label: 'Título', type: 'text', filtered: true, },
    { key: 'ruc', label: 'RUC', type: 'text', filtered: true, },
    { key: 'phone', label: 'Teléfono', type: 'text', filtered: true, },
    { key: 'company', label: 'Empresa', type: 'relation-name', filtered: false, },
  ];
  private headShift: DataListColumn<Shift>[] = [
    { key: 'id', label: 'N°', type: 'number', filtered: false, },
    { key: 'name', label: 'Nombre', type: 'text', filtered: true, },
    { key: 'shortName', label: 'Nombre corto', type: 'text', filtered: true, },
  ];
  private headUnit: DataListColumn<Unit>[] = [
    { key: 'id', label: 'N°', type: 'number', filtered: false, },
    { key: 'code', label: 'Código', type: 'text', filtered: true, },
    { key: 'name', label: 'Nombre', type: 'text', filtered: true, },
    { key: 'customer', label: 'Cliente', type: 'relation-name', filtered: false, },
    { key: 'center', label: 'Centro de costo', type: 'relation-name', filtered: true, },
    { key: 'shifts', label: 'Turnos', type: 'relation-name-multi', filtered: true, },
  ];
  private headAssignment: DataListColumn<Assignment>[] = [
    { key: 'id', label: 'N°', type: 'number', filtered: false },
    { key: 'unitshift', label: 'Unidad', type: 'relation-unit', filtered: false },
    { key: 'unitshift', label: 'Turno', type: 'relation-shift', filtered: false },
    { key: 'start_date', label: 'Fecha de asignación', type: 'date', filtered: true },
    { key: 'end_date', label: 'Fin de asignación', type: 'date', filtered: true },
    { key: 'state', label: 'Estado', type: 'state', filtered: false },
    { key: 'workers_count', label: '# Asignados', type: 'text', filtered: false },
  ];

  getHeaderDataList(param: string): DataListColumn<any>[] {
    switch (param) {
      case PARAMETERS.WORKER:
        return this.headWorker;
        break;
      case PARAMETERS.REASSIGNMENT:
        return this.headWorkerAssign;
        break;
      case PARAMETERS.TYPEWORKER:
        return this.headTypeWorker;
        break;
      case PARAMETERS.CENTER:
        return this.headCenter;
        break;
      case PARAMETERS.COMPANY:
        return this.headCompany;
        break;
      case PARAMETERS.CUSTOMER:
        return this.headCustomer;
        break;
      case PARAMETERS.SHIFT:
        return this.headShift;
        break;
      case PARAMETERS.UNIT:
        return this.headUnit;
        break;
      case PARAMETERS.ASSIGNMENT:
        return this.headAssignment;
        break;
      default:
        return [];
        break;
    }
  }

  getFiltered(param: string): string[] {
    switch (param) {
      case PARAMETERS.WORKER:
        return this.headWorker.filter(column => column.filtered).map(column => column.key);
        break;
      case PARAMETERS.TYPEWORKER:
        return this.headTypeWorker.filter(column => column.filtered).map(column => column.key);
        break;
      case PARAMETERS.CENTER:
        return this.headCenter.filter(column => column.filtered).map(column => column.key);
        break;
      case PARAMETERS.CUSTOMER:
        return this.headCustomer.filter(column => column.filtered).map(column => column.key);
        break;
      case PARAMETERS.COMPANY:
        return this.headCompany.filter(column => column.filtered).map(column => column.key);
        break;
      case PARAMETERS.SHIFT:
        return this.headShift.filter(column => column.filtered).map(column => column.key);
        break;
      case PARAMETERS.UNIT:
        return this.headUnit.filter(column => column.filtered).map(column => column.key);
        break;
      default:
        return [];
        break;
    }
  }

  getInternal(param: string): DataListColumn<any>[] {
    switch (param) {
      case PARAMETERS.WORKER:
        return this.headWorker.filter(column => column.internal);
        break;
      default:
        return [];
        break;
    }
  }
}
