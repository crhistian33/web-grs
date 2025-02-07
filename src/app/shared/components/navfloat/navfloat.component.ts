import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, Input, NgZone, Renderer2 } from '@angular/core';
import { NgIconsModule } from '@ng-icons/core';

@Component({
  selector: 'app-navfloat',
  imports: [CommonModule, NgIconsModule],
  templateUrl: './navfloat.component.html',
  styleUrl: './navfloat.component.scss',
  animations: [
      trigger('fadeInOut', [
        state('void', style({
          height: 0,
          opacity: 0
        })),
        transition('void => *', [
          animate('100ms ease-in-out', style({
            height: '*',
            opacity: 1
          }))
        ]),
        transition('* => void', [
          animate('100ms ease-in-out', style({
            height: 0,
            opacity: 0
          }))
        ])
      ])
    ]
})
export class NavfloatComponent {
  @Input() state!: string;
  isOpen = false;

  constructor(private eRef: ElementRef, private renderer: Renderer2) {}

  toggleNav(event: Event) {
    //event.stopPropagation(); // Evita que el click en el botón dispare el HostListener
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
