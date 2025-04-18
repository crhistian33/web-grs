import { DatePipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { RelationType } from '@shared/models/dataListColumn.model';
import { MONTHS } from '@shared/utils/constants';

@Pipe({
  name: 'cellValue',
  standalone: true,
})
export class CellValuePipe implements PipeTransform {

  private datePipe = inject(DatePipe);

  transform(value: any, type?: string, key?: string): string {
    if (value === null || value === undefined) return '';

    switch(type) {
      case 'relation-name':
        return this.getRelationName(value);
      case 'relation-dni':
        return this.getRelationDni(value);
      case 'relation-name-multi':
        return this.getRelationNameMulti(value);
      case 'date':
        return this.datePipe.transform(value, 'dd/MM/yyyy') || '';
      case 'relation-unit':
        return this.getUnit(value);
      case 'relation-shift':
        return this.getShift(value);
      case 'relations-unit':
        return this.getUnits(value);
      case 'relations-shift':
        return this.getShifts(value);
      case 'state':
        return value ? 'Activo' : 'Inactivo';
      case 'month':
        return this.getMonth(value);
      default:
        return String(value);
    }
  }

  private getRelationName(value: any): string {
    if (value && typeof value === 'object' && 'name' in value) {
      return (value as RelationType)['name'];
    }
    return '';
  }

  private getRelationDni(value: any): string {
    if (value && typeof value === 'object' && 'name' in value) {
      return (value as RelationType)['dni'];
    }
    return '';
  }

  private getRelationNameMulti(values: any): string {
    const fields = values.map((item: any) => item.name);
    return fields.join(', ');
  }

  private getUnit(value: any) {
    const unit = value.unit.name;
    return unit;
  }

  private getShift(value: any) {
    const shift = value.shift.name;
    return shift;
  }

  private getUnits(value: any) {
    const unit = value.unitshift ? value.unitshift.unit.name : value.unit.name;
    return unit;
  }

  private getShifts(value: any) {
    const shift = value.unitshift.shift.name;
    return shift;
  }

  private getMonth(value: any): string {
    const monthName = MONTHS.find((_, index) => index === value);
    return monthName ?? '';
  }
}
