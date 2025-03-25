import { Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'nuevo',
    component: FormComponent,
    data: { breadcrumb: 'Nuevo' }
  },
  {
    path: 'editar/:id/:month',
    component: FormComponent,
    data: { breadcrumb: 'Editar descanso' }
  }
];
