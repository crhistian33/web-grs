import { Routes } from '@angular/router';
import { TaskHomeComponent } from './task-home/task-home.component';

export const routes: Routes = [
  {
    path: '',
    component: TaskHomeComponent
  },
  {
    path:'asignaciones',
    loadChildren: () => import('./assignment/assignment.routes').then(m => m.routes),
    data: { breadcrumb: 'asignaciones' }
  },
];
