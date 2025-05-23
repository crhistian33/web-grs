import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconsModule } from '@ng-icons/core';
import { Store } from '@ngxs/store';
import { Breadcrumb } from '@shared/models/breadcrumb.model';
import { BreadcrumbService } from '@shared/services/breadcrumb.service';
import { BreadcrumbState } from '@shared/state/breadcrumb/breadcrumb.state';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterLink, NgIconsModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  private readonly store = inject(Store)
  private readonly breadcrumbService = inject(BreadcrumbService)

  breadcrumbs$: Observable<Breadcrumb[] | null> = this.store.select(BreadcrumbState.getBreadcrumbs);
}
