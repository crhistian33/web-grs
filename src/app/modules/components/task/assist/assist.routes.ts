import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { ListBreakComponent } from './list-break/list-break.component';

export const routes: Routes = [
  {
    path: '',
    component: ListComponent
  },
  {
    path:'descanseros',
    component: ListBreakComponent
  },
  {
      path: 'nuevo',
      component: FormComponent,
      data: { breadcrumb: 'Nuevo' }
    },
    {
      path: 'editar/:id',
      component: FormComponent,
      data: { breadcrumb: 'Editar asistencia' }
    }
];
