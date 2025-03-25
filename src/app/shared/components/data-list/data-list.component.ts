import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgIconsModule } from '@ng-icons/core';

import { BaseModel } from '../../models/base.model';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { CellValuePipe } from '@shared/pipes/cell-value.pipe';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { MONTHS } from '@shared/utils/constants';

@Component({
  selector: 'app-data-list',
  imports: [CommonModule, RouterLink, NgIconsModule, CellValuePipe, TooltipComponent],
  providers: [DatePipe],
  templateUrl: './data-list.component.html',
  styleUrl: './data-list.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        height: 0,
        opacity: 0
      })),
      transition('void => *', [
        animate('300ms ease-in-out', style({
          height: '*',
          opacity: 1
        }))
      ]),
      transition('* => void', [
        animate('300ms ease-in-out', style({
          height: 0,
          opacity: 0
        }))
      ])
    ])
  ]
})
export class DataListComponent<T extends BaseModel> implements OnInit, OnChanges {
  @Output() deleteItem = new EventEmitter<number>();
  @Output() deleteItemMonth = new EventEmitter<{ id: number, month: number}>();
  @Output() restoreItem = new EventEmitter<number>();
  @Output() toggleItem = new EventEmitter<number>();
  @Output() toggleAll = new EventEmitter<boolean>();
  @Output() assign = new EventEmitter<any>();
  @Output() valueDay = new EventEmitter<{ id: number, date: string }>();
  @Input() data: T[] | null = [];
  @Input() columns: DataListColumn<T>[] | null = [];
  @Input() areAllSelected: boolean = false;
  @Input() page!: string;
  @Input() hiddenActions: boolean = false;
  @Input() titleTable!: string;

  expandedRows: { [key: number]: boolean } = {};
  isShown = false;
  panelStates = new Map<number, boolean>();
  days: number = 1;

  // Paginación
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Ordenamiento
  sortColumn: string = '';
  sortAsc: boolean = true;

  // Datos filtrados y paginados
  filteredData: T[] = [];
  paginatedData: T[] = [];

  get dataTable(): T[] {
    return this.data || [];
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.totalItems);
  }

  ngOnInit() {
    this.initializeData();
  }

  private initializeData() {
    if(this.data) {
      this.filteredData = [...this.data];
      this.totalItems = this.data.length;
      this.updatePaginatedData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['data'])
      this.initializeData();
  }

  onToggleItem(id: number) {
    if(this.page === 'asistencia')
      return;
    this.toggleItem.emit(id);
  }

  onToggleAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.toggleAll.emit(isChecked);
  }

  onDelete(id: number) {
    this.deleteItem.emit(id);
  }

  onDeleteItemMonth(id: number, month: number) {
    this.deleteItemMonth.emit({ id, month });
  }

  onRestore(id: number) {
    this.restoreItem.emit(id);
  }

  onReassign(item: any) {
    this.assign.emit(item);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updatePaginatedData();
  }

  private updatePaginatedData() {
    const start = this.startIndex;
    const end = this.endIndex;
    this.paginatedData = this.filteredData.slice(start, end);
    this.paginatedData.forEach(item => {
      this.panelStates.set(item.id, false);
    })
  }

  togglePanel(id: number) {
    this.panelStates.set(id, !this.panelStates.get(id));
  }

  protected getDynamicData(item: T): any {
    if(item) {
      const dynamicData = (item as any)['days'];
      this.days = Array.isArray(dynamicData) ? dynamicData.length : 1;
      return Array.isArray(dynamicData) ? dynamicData : [];
    }
    return [];
  }

  protected getMonthData(item: T): any {
    if(item) {
      const monthCountMap = new Map<number, number>();

      const dynamicData = (item as any)['days'];
      dynamicData.forEach((day: any) => {
        const count = monthCountMap.get(day.month) || 0;
        monthCountMap.set(day.month, count + 1);
      });
      const result = Array.from(monthCountMap.entries()).map(([monthNumber, count]) => ({
        name: MONTHS.find((_, index) => index === monthNumber -1),
        count
      }));

      return result;
    }
    return [];
  }

  getMonthValue(item: T) {
    const month = (item as any)['month'];

    if (month !== null && month !== undefined)
      return month.toString();

    return null;
  }

  getWorkerValue(item: T) {
    const worker = (item as any)['worker'];

    if (worker !== null && worker !== undefined)
      return worker.id;

    return null;
  }

  protected getColumnClasses(index: number, key?: any): any {
    return {
      'w-2': key && key === 'id',
      [this.getStickyColumn(index)]: this.page === 'asistencia' && index < 2
    };
  }

  protected getStickyColumn(index: number): string {
    if (index === 0) return 'sticky left-0 z-10';
    if (index === 1) return 'sticky left-8 z-10';
    return '';
  }

  protected changeValueDay(id: number, date: string) {
    this.valueDay.emit({ id, date });
  }
}
