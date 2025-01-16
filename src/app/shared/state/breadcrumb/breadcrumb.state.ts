import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Breadcrumb, BreadcrumbStateModel } from '@shared/models/breadcrumb.model';
import { UpdateBreadcrumbs } from './breadcrumb.actions';

@State<BreadcrumbStateModel>({
  name: 'breadcrumb',
  defaults: {
    breadcrumbs: []
  }
})
@Injectable()
export class BreadcrumbState {

  @Selector()
  static getBreadcrumbs(state: BreadcrumbStateModel): Breadcrumb[] {
    return state.breadcrumbs;
  }

  @Action(UpdateBreadcrumbs)
  updateBreadcrumbs(ctx: StateContext<BreadcrumbStateModel>, action: UpdateBreadcrumbs) {
    ctx.setState({
      breadcrumbs: action.breadcrumbs
    });
  }
}
