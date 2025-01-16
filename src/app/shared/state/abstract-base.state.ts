import { StateContext, Selector } from '@ngxs/store';
import { BaseStateModel } from '@shared/models/base-state.model';
import { BaseModel } from '@shared/models/base.model';
import { BaseCrudService } from '@shared/services/base-crud.service';
import { tap } from 'rxjs';

export abstract class AbstractBaseState<T extends BaseModel> {
  constructor(private service: any) {}

  @Selector()
  static items<T extends BaseModel>(state: BaseStateModel<T>): T[] {
    return state.entities;
  }

  getAll({ patchState }: StateContext<BaseStateModel<T>>) {
    patchState({ loading: true, error: null });
      return this.service.getAll().pipe(
        tap({
          next: (response: any) => {
            console.log(response.data)
            patchState({ entities: response.data, filteredItems: response.data, loading: false })
          },
          error: (error) => patchState({ error: error.message, loading: false })
        })
      )
  }
}
