import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconsModule } from '@ng-icons/core';

@Component({
  selector: 'app-actions',
  imports: [CommonModule, NgIconsModule, RouterLink],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss'
})
export class ActionsComponent {
  @Output() searchList = new EventEmitter<string>();
  @Output() deleteAll = new EventEmitter<void>();
  @Output() restoreAll = new EventEmitter<void>();
  @Output() reassignAll = new EventEmitter<void>();
  @Input() hasSelectedItem: boolean = false;
  @Input() page!: string;

  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchList.emit(searchTerm);
  }

  onRestoreAll() {
    this.restoreAll.emit();
  }

  onDeleteAll() {
    this.deleteAll.emit();
  }

  onReassignAll() {
    this.reassignAll.emit();
  }
}
