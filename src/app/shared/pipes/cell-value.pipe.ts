import { DatePipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { RelationType } from '@shared/models/dataListColumn.model';

@Pipe({
  name: 'cellValue',
  standalone: true,
})
export class CellValuePipe implements PipeTransform {

  private datePipe = inject(DatePipe);

  transform(value: any, type?: string): string {
    if (value === null || value === undefined) return '';

    switch(type) {
      case 'relation-name':
        return this.getRelationName(value);
      case 'relation-name-multi':
        return this.getRelationNameMulti(value);
      case 'date':
        return this.datePipe.transform(value, 'dd/MM/yyyy') || '';
      case 'state':
        return value ? 'Activo' : 'Inactivo';
      default:
        return String(value);
    }
  }

  private getRelationName(value: any): string {
    if (value && typeof value === 'object' && 'name' in value) {
      return (value as RelationType).name;
    }
    return '';
  }

  private getRelationNameMulti(values: any): string {
    const fields = values.map((item: any) => item.name);
    return fields.join(', ');
  }
}
