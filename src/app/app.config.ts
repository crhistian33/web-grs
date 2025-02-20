import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { provideStore } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { provideIcons, provideNgIconsConfig } from '@ng-icons/core';
import { heroArrowLeftOnRectangleSolid, heroArrowUturnLeftSolid, heroBellAlertSolid, heroChevronDownSolid, heroClipboardDocumentCheckSolid, heroDocumentCheckSolid, heroEllipsisVerticalSolid, heroHomeSolid, heroKeySolid, heroListBulletSolid, heroMagnifyingGlassSolid, heroMinusSolid, heroPencilSquareSolid, heroPlusSolid, heroTrashSolid, heroUserCircleSolid, heroUserSolid, heroUsersSolid, heroWrenchSolid, heroXMarkSolid } from '@ng-icons/heroicons/solid';

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
import { AssistState } from '@state/assist/assist.state';
import { CalendarState } from '@shared/state/calendar/calendar.state';
import { AuthState } from './auth/state/auth.state';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { UserState } from '@state/user/user.state';
import { authInterceptor } from './interceptors/auth.interceptor';
import { CollapseState } from '@shared/state/collapse/collapse.state';

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
      }),
      NgxsStoragePluginModule.forRoot({
        keys: ['auth.access_token', 'auth.refresh_token', 'auth.isAuthenticated', 'user', 'auth.userId']
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
      AssistState,
      CalendarState,
      AuthState,
      UserState,
      CollapseState,
    ], {
      developmentMode: !environment.production,
      selectorOptions: {
        suppressErrors: false,
        injectContainerState: false
      }
    }),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),
    ReactiveFormsModule,
    provideNgIconsConfig({ size: '1.5em' }),
    provideIcons({ heroHomeSolid, heroUsersSolid, heroPlusSolid, heroDocumentCheckSolid, heroPencilSquareSolid, heroTrashSolid, heroWrenchSolid, heroArrowLeftOnRectangleSolid, heroListBulletSolid, heroArrowUturnLeftSolid, heroBellAlertSolid, heroChevronDownSolid, heroMagnifyingGlassSolid, heroMinusSolid, heroUserCircleSolid, heroClipboardDocumentCheckSolid, heroXMarkSolid, heroUserSolid, heroKeySolid, heroEllipsisVerticalSolid }),
  ]
};
