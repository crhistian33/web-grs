import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { RemovesComponent } from './removes/removes.component';

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'nuevo',
    component: FormComponent,
    data: { breadcrumb: 'Nuevo' },
  },
  {
    path: 'editar/:id',
    component: FormComponent,
    data: { breadcrumb: 'Editar empresa' },
  },
  {
    path: 'removidos',
    component: RemovesComponent,
    data: { breadcrumb: 'Papelera' },
  },
];
