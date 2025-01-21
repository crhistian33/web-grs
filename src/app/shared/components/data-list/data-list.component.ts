import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgIconsModule } from '@ng-icons/core';

import { BaseModel } from '../../models/base.model';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { CellValuePipe } from '@shared/pipes/cell-value.pipe';

@Component({
  selector: 'app-data-list',
  imports: [CommonModule, RouterLink, NgIconsModule, CellValuePipe],
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
export class DataListComponent<T extends BaseModel, N = any> implements OnInit, OnChanges {
  @Output() deleteItem = new EventEmitter<number>();
  @Output() restoreItem = new EventEmitter<number>();
  @Output() toggleItem = new EventEmitter<number>();
  @Output() toggleAll = new EventEmitter<boolean>();
  @Input() data: T[] | null = [];
  @Input() columns: DataListColumn<T>[] = [];
  @Input() areAllSelected: boolean = false;
  @Input() nestedColumns?: DataListColumn<N>[];
  @Input() getNestedDataFn?: (item: T) => N[];
  @Input() page!: string;
  @Input() hiddenActions: boolean = false;
  expandedRows: { [key: number]: boolean } = {};
  isShown = false;
  panelStates = new Map<number, boolean>();

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

  hasNestedData(item: T): boolean {
    if(this.getNestedDataFn) {
      this.isShown = true;
      return this.getNestedDataFn(item)?.length > 0;
    }
    this.isShown = false;
    return false;
  }

  getNestedData(item: T): N[] {
    const items = this.getNestedDataFn ? this.getNestedDataFn(item) : [];
    return items;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['data'])
      this.initializeData();
  }

  onToggleItem(id: number) {
    this.toggleItem.emit(id);
  }

  onToggleAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.toggleAll.emit(isChecked);
  }

  onDelete(id: number) {
    this.deleteItem.emit(id);
  }

  onRestore(id: number) {
    this.restoreItem.emit(id);
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
}
