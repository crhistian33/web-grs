import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.routes),
  },
  {
    path: '',
    loadChildren: () => import('./modules/modules.routes').then(m => m.routes),
  },
];
