import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoadingState } from '@shared/state/loading/loading.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  store = inject(Store);

  isLoading$: Observable<boolean> = this.store.select(LoadingState.anyLoading);
}
