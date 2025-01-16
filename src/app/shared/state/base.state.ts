import { Injectable } from '@angular/core';
import { State, StateContext } from '@ngxs/store';
import { BaseStateModel } from '@shared/models/base-state.model';
import { BaseModel } from '@shared/models/base.model';
import { BaseCrudService } from '@shared/services/base-crud.service';
import { finalize, tap } from 'rxjs';
import { SetLoading } from './loading/loading.actions';

@State<BaseStateModel<any>>({
  name: 'base',
  defaults: {
    entities: [],
    filteredItems: [],
    trashedItems: [],
    selectedEntity: null,
    searchTerm: '',
    result: null,
  },
})
@Injectable()
export class BaseState<T extends BaseModel> {
  constructor(protected service: BaseCrudService<T>) {}

  protected getItems(ctx: StateContext<BaseStateModel<T>>, type: string) {
    ctx.dispatch(new SetLoading(type, true));
    return this.service.getAll().pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities: response.data,
            filteredItems: response.data,
          })
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    );
  }

  protected getItemsDelete(ctx: StateContext<BaseStateModel<T>>, type: string) {
    ctx.dispatch(new SetLoading(type, true));
    return this.service.getDeletes().pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities: response.data,
            filteredItems: response.data,
          })
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    );
  }

  protected getOne(ctx: StateContext<BaseStateModel<T>>, id: number, type: string) {
    ctx.dispatch(new SetLoading(type, true));
    return this.service.getById(id).pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            selectedEntity: response.data,
          })
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    );
  }

  protected getItemsFilter(ctx: StateContext<BaseStateModel<T>>, searchTerm: string, columns: (keyof T)[]) {
    const state = ctx.getState();
    const filtered = state.entities.filter((item) =>
      columns.some((column) => {
        const value = item[column] ? item[column].toString().toLowerCase() : '';
        return value.includes(searchTerm.toLowerCase());
      })
    );
    ctx.patchState({ searchTerm, filteredItems: filtered });
  }

  protected countItemsTrashed(ctx: StateContext<BaseStateModel<T>>) {
    return this.service.getDeletes().pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            trashedItems: response.data,
          })
        },
      })
    );
  }

  protected createItem(ctx: StateContext<BaseStateModel<T>>, payload: T, type: string) {
    ctx.dispatch(new SetLoading(type, true));
    return this.service.create(payload).pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities: [...ctx.getState().entities, response.data],
            filteredItems: [...ctx.getState().filteredItems, response.data],
            result: { title: response.title, message: response.message },
          })
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    )
  }

  protected updateItem(ctx: StateContext<BaseStateModel<T>>, payload: Partial<T>, id: number, type: string) {
    ctx.dispatch(new SetLoading(type, true));
    return this.service.update(id, payload)
    .pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            selectedEntity: response.data,
            result: { title: response.title, message: response.message },
          });
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    )
  }

  protected deleteItem(ctx: StateContext<BaseStateModel<T>>, id: number, del: boolean, type: string) {
    ctx.dispatch(new SetLoading(type, true));
    const state = ctx.getState();
    const entities = state.entities.filter(item => item.id !== id);
    return this.service.delete(id, del).pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities,
            filteredItems: entities,
            result: { title: response.title, message: response.message },
          });
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    )
  }

  protected restoreItem(ctx: StateContext<BaseStateModel<T>>, id: number, type: string) {
    ctx.dispatch(new SetLoading(type, true));
    const state = ctx.getState();
    return this.service.restore(id).pipe(
      tap({
        next: (response: any) => {
          const entities = state.entities.filter(item => item.id !== id);
          ctx.patchState({
            entities,
            filteredItems: entities,
            result: { title: response.title, message: response.message },
          });
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    )
  }

  protected deleteAllItem(ctx: StateContext<BaseStateModel<T>>, payload: T[], del: boolean, type: string) {
    ctx.dispatch(new SetLoading(type, true));
    const state = ctx.getState();
    const entities = state.entities.filter(item => !payload.some(element => element.id === item.id));
    return this.service.deleteAll(payload, del).pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities,
            filteredItems: entities,
            result: { title: response.title, message: response.message },
          });
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    )
  }

  protected restoreAllItem(ctx: StateContext<BaseStateModel<T>>, payload: T[], type: string) {
    ctx.dispatch(new SetLoading(type, true));
    const state = ctx.getState();
    const entities = state.entities.filter(item =>
      !payload.some(element => element.id === item.id)
    );
    return this.service.restoreAll(payload).pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities,
            filteredItems: entities,
            result: { title: response.title, message: response.message },
          });
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      }),
      finalize(() => {
        ctx.dispatch(new SetLoading(type, false));
      })
    )
  }

  protected toggleSelectionItem(ctx: StateContext<BaseStateModel<T>>, id: number) {
    const state = ctx.getState();
    const entities = state.entities.map(entity =>
      entity.id === id
        ? { ...entity, selected: !entity.selected }
        : entity
    );
    ctx.patchState({ entities, filteredItems: entities });
  }

  protected toggleAllItem(ctx: StateContext<BaseStateModel<T>>, selected: boolean) {
    const state = ctx.getState();
    const entities = state.entities.map(entity => ({
      ...entity,
      selected: selected
    }));
    ctx.patchState({ entities, filteredItems: entities });
  }
}
