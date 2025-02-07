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
  {
    path:'reasignaciones',
    loadChildren: () => import('./reassignment/reassignment.routes').then(m => m.routes),
    data: { breadcrumb: 'reasignaciones' }
  },
  {
    path:'asistencias',
    loadChildren: () => import('./assist/assist.routes').then(m => m.routes),
    data: { breadcrumb: 'asistencias' }
  },
  {
    path:'descansos',
    loadChildren: () => import('./break/break.routes').then(m => m.routes),
    data: { breadcrumb: 'descansos' }
  },
];
