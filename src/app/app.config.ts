import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { provideStore } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { provideIcons, provideNgIconsConfig } from '@ng-icons/core';
import { heroArrowLeftOnRectangleSolid, heroArrowUturnLeftSolid, heroBellAlertSolid, heroChevronDownSolid, heroClipboardDocumentCheckSolid, heroDocumentCheckSolid, heroHomeSolid, heroListBulletSolid, heroMagnifyingGlassSolid, heroMinusSolid, heroPencilSquareSolid, heroPlusSolid, heroTrashSolid, heroUserCircleSolid, heroUsersSolid, heroWrenchSolid, heroXMarkSolid } from '@ng-icons/heroicons/solid';

import { routes } from './app.routes';
import { environment } from '@environments/environment.development';
import { WorkerState } from '@state/worker/worker.state';
import { CompanyState } from '@state/company/company.state';
import { TypeworkerState } from '@state/typeworker/typeworker.state';
import { CenterState } from '@state/center/center.state';
import { CustomerState } from '@state/customer/customer.state';
import { ShiftState } from '@state/shift/shift.state';
import { UnitState } from '@state/unit/unit.state';
import { LoadingState } from '@shared/state/loading/loading.state';
import { BreadcrumbState } from '@shared/state/breadcrumb/breadcrumb.state';
import { FilterState } from '@shared/state/filter/filter.state';
import { AssignmentState } from '@state/assignment/assignment.state';
import { CountState } from '@state/count/count.state';
import { VerifiedState } from '@shared/state/verified/verified.state';
import { WorkerassignmentState } from '@state/workerassignment/workerassignment.state';
import { UnitshiftState } from '@state/unitshift/unitshift.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withComponentInputBinding()
    ),
    importProvidersFrom([
      NgxsReduxDevtoolsPluginModule.forRoot({
        disabled: environment.production
      }),
      NgxsLoggerPluginModule.forRoot({
        disabled: environment.production
      })
    ]),
    provideStore([
      BreadcrumbState,
      LoadingState,
      FilterState,
      CountState,
      VerifiedState,
      WorkerState,
      CompanyState,
      TypeworkerState,
      CenterState,
      CustomerState,
      ShiftState,
      UnitState,
      AssignmentState,
      WorkerassignmentState,
      UnitshiftState,
    ], {
      developmentMode: !environment.production,
      selectorOptions: {
        suppressErrors: false,
        injectContainerState: false
      }
    }),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    ReactiveFormsModule,
    provideNgIconsConfig({ size: '1.5em' }),
    provideIcons({ heroHomeSolid, heroUsersSolid, heroPlusSolid, heroDocumentCheckSolid, heroPencilSquareSolid, heroTrashSolid, heroWrenchSolid, heroArrowLeftOnRectangleSolid, heroListBulletSolid, heroArrowUturnLeftSolid, heroBellAlertSolid, heroChevronDownSolid, heroMagnifyingGlassSolid, heroMinusSolid, heroUserCircleSolid, heroClipboardDocumentCheckSolid, heroXMarkSolid })

  ]
};
