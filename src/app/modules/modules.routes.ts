import { Routes } from '@angular/router';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { ModuleHomeComponent } from './components/module-home/module-home.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        component: ModuleHomeComponent,
        data: { breadcrumb: 'Inicio' }
      },
      {
        path: 'tareo',
        loadChildren: () => import('./components/task/task.routes').then(m => m.routes),
        data: { breadcrumb: 'tareo' }
      },
      {
        path: 'mantenimiento',
        loadChildren: () => import('./components/maintenance/maintenance.routes').then(m=>m.routes),
        data: { breadcrumb: 'Mantenimiento' }
      }
    ]
  },
];
