import { Routes } from '@angular/router';
import { FormComponent } from './form/form.component';

export const routes: Routes = [
  {
      path: 'nuevo',
      component: FormComponent,
      data: { breadcrumb: 'Nuevo' }
    },
    {
      path: 'editar/:id',
      component: FormComponent,
      data: { breadcrumb: 'Editar descanso' }
    }
];
