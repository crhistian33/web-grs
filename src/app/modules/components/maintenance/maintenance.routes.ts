import { Routes } from '@angular/router';
import { MaintenanceHomeComponent } from './maintenance-home/maintenance-home.component';
import { authGuard } from 'src/app/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MaintenanceHomeComponent
  },
  {
    path:'trabajadores',
    loadChildren: () => import('./workers/workers.routes').then(m => m.routes),
    canActivate: [authGuard],
    data: { moduleKey: 'Worker', breadcrumb: 'Trabajadores' },
  },
  {
    path:'tipos-trabajadores',
    loadChildren: () => import('./typeWorker/typeworker.routes').then(m => m.routes),
    canActivate: [authGuard],
    data: { moduleKey: 'TypeWorker', breadcrumb: 'Tipos de trabajadores' },
  },
  {
    path: 'centros-costo',
    loadChildren: () => import('./center/center.routes').then(m => m.routes),
    canActivate: [authGuard],
    data: { moduleKey: 'Center', breadcrumb: 'Centros de costo' },
  },
  {
    path: 'empresas',
    loadChildren: () => import('./company/company.routes').then(m => m.routes),
    canActivate: [authGuard],
    data: { moduleKey: 'Company', breadcrumb: 'Empresas' },
  },
  {
    path: 'clientes',
    loadChildren: () => import('./customer/customer.routes').then(m => m.routes),
    canActivate: [authGuard],
    data: { moduleKey: 'Customer', breadcrumb: 'Clientes' },
  },
  {
    path: 'unidades',
    loadChildren: () => import('./unit/unit.routes').then(m => m.routes),
    canActivate: [authGuard],
    data: { moduleKey: 'Unit', breadcrumb: 'Unidades' },
  },
  {
    path: 'turnos',
    loadChildren: () => import('./shift/shift.routes').then(m => m.routes),
    canActivate: [authGuard],
    data: { moduleKey: 'Shift', breadcrumb: 'Turnos' },
  },
];
