import { DestroyRef, Directive, ElementRef, EventEmitter, inject, Output } from '@angular/core';
import { filter, fromEvent } from 'rxjs';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {

  @Output() clickOutside = new EventEmitter<void>();

  private element = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    const documentClickSubscription = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => {
          const clickTarget = event.target as HTMLElement;
          return !this.element.nativeElement.contains(clickTarget);
        })
      )
      .subscribe(() => this.clickOutside.emit());

    // Cleanup subscription when directive is destroyed
    this.destroyRef.onDestroy(() => {
      documentClickSubscription.unsubscribe();
    });
  }

}
