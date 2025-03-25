import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIconsModule } from '@ng-icons/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, NgIconsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Output() closeEvent = new EventEmitter<void>();
  @Input() isOpen: boolean = false;
  @Input() title!: string;

  closeModal() {
    this.closeEvent.emit();
  }
}
