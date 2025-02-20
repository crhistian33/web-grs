import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {
  @Input() text: string = '';
  @Input() type: string = '';
  @Input() position: 'top' | 'right' | 'bottom' | 'left' = 'top';

  isVisible: boolean = false;

  get tooltipPositionClass(): string {
    const positions = {
      'top': '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
      'right': 'top-1/2 -right-1 translate-x-full -translate-y-1/2',
      'bottom': '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
      'left': 'top-1/2 -left-2 -translate-x-full -translate-y-1/2'
    };
    return positions[this.position];
  }

  get arrowPositionClass(): string {
    const positions = {
      'top': 'bottom-[-4px] left-1/2 -translate-x-1/2',
      'right': 'left-[-4px] top-1/2 -translate-y-1/2',
      'bottom': 'top-[-4px] left-1/2 -translate-x-1/2',
      'left': 'right-[-4px] top-1/2 -translate-y-1/2'
    };
    return positions[this.position];
  }

  showTooltip(): void {
    this.isVisible = true;
  }

  hideTooltip(): void {
    this.isVisible = false;
  }
}
