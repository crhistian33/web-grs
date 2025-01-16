import { Routes } from '@angular/router';
import { MaintenanceHomeComponent } from './maintenance-home/maintenance-home.component';

export const routes: Routes = [
  {
    path: '',
    component: MaintenanceHomeComponent
  },
  {
    path:'trabajadores',
    data: { moduleKey: 'Worker', breadcrumb: 'Trabajadores' },
    loadChildren: () => import('./workers/workers.routes').then(m => m.routes),
  },
  {
    path:'tipos-trabajadores',
    data: { moduleKey: 'TypeWorker', breadcrumb: 'Tipos de trabajadores' },
    loadChildren: () => import('./typeWorker/typeworker.routes').then(m => m.routes),
  },
  {
    path: 'centros-costo',
    data: { moduleKey: 'Center', breadcrumb: 'Centros de costo' },
    loadChildren: () => import('./center/center.routes').then(m => m.routes)
  },
  {
    path: 'empresas',
    data: { moduleKey: 'Company', breadcrumb: 'Empresas' },
    loadChildren: () => import('./company/company.routes').then(m => m.routes)
  },
  {
    path: 'clientes',
    data: { moduleKey: 'Customer', breadcrumb: 'Clientes' },
    loadChildren: () => import('./customer/customer.routes').then(m => m.routes)
  },
  {
    path: 'unidades',
    data: { moduleKey: 'Unit', breadcrumb: 'Unidades' },
    loadChildren: () => import('./unit/unit.routes').then(m => m.routes)
  },
  {
    path: 'turnos',
    data: { moduleKey: 'Shift', breadcrumb: 'Turnos' },
    loadChildren: () => import('./shift/shift.routes').then(m => m.routes)
  },
];
