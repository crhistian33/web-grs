// responsive-table.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

interface TableData {
  id: number | string;
  [key: string]: any;
}
@Component({
  selector: 'app-data-table',
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: TableData[] = [];
  @Input() loading: Observable<boolean> = of(false);

  // Paginación
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Ordenamiento
  sortColumn: string = '';
  sortAsc: boolean = true;

  // Datos filtrados y paginados
  filteredData: TableData[] = [];
  paginatedData: TableData[] = [];

  ngOnInit() {
    this.initializeData();
  }

  ngOnChanges() {
    this.initializeData();
  }

  private initializeData() {
    this.filteredData = [...this.data];
    this.totalItems = this.data.length;
    this.updatePaginatedData();
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.totalItems);
  }

  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredData = this.data.filter(item => {
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchTerm)
      )}
    );
    this.totalItems = this.filteredData.length;
    this.currentPage = 1;
    this.updatePaginatedData();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = column;
      this.sortAsc = true;
    }

    this.filteredData.sort((a, b) => {
      const multiplier = this.sortAsc ? 1 : -1;
      return a[column] > b[column] ? multiplier : -multiplier;
    });

    this.updatePaginatedData();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updatePaginatedData();
  }

  private updatePaginatedData() {
    const start = this.startIndex;
    const end = this.endIndex;
    this.paginatedData = this.filteredData.slice(start, end);
  }

  onEdit(item: TableData) {
    console.log('Editar:', item);
  }

  onDelete(item: TableData) {
    console.log('Eliminar:', item);
  }
}
