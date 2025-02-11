import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { User } from '@models/user.model';
import { NgIconsModule } from '@ng-icons/core';
import { Store } from '@ngxs/store';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { CollapseAction } from '@shared/state/collapse/collapse.actions';
import { CollapseState } from '@shared/state/collapse/collapse.state';
import { UserState } from '@state/user/user.state';
import { Observable } from 'rxjs';
import { AuthAction } from 'src/app/auth/state/auth.actions';

@Component({
  selector: 'app-header',
  imports: [CommonModule, NgIconsModule, ClickOutsideDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly store = inject(Store);
  private readonly sweetAlertService = inject(SweetalertService);

  user$: Observable<User | null> = this.store.select(UserState.getItem);
  isShowMenu$ = this.store.select(CollapseState.getNavUser);

  toggleMenu() {
    this.store.dispatch(new CollapseAction.toggleNavUser);
  }

  closeMenu(): void {
    this.store.dispatch(new CollapseAction.closeNavUser());
  }

  logout() {
    this.store.dispatch(new CollapseAction.closeNavUser);
    this.sweetAlertService.confirmAction('¿Cerrar sesión?', 'Se perderán los cambios no guardados', 'Cerrar sessión', () => {
      this.store.dispatch(new AuthAction.Logout);
    })
  }
}
