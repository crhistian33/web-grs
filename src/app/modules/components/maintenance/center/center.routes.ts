import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { RemovesComponent } from './removes/removes.component';
import { authGuard } from 'src/app/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'nuevo',
    component: FormComponent,
    canActivate: [authGuard],
    data: { breadcrumb: 'Nuevo' },
  },
  {
    path: 'editar/:id',
    component: FormComponent,
    canActivate: [authGuard],
    data: { breadcrumb: 'Editar centro' },
  },
  {
    path: 'removidos',
    canActivate: [authGuard],
    component: RemovesComponent,
    data: { breadcrumb: 'Papelera' },
  },
];
