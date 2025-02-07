import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { User } from '@models/user.model';
import { NgIconsModule } from '@ng-icons/core';
import { Store } from '@ngxs/store';
import { UserState } from '@state/user/user.state';
import { Observable } from 'rxjs';
import { AuthAction } from 'src/app/auth/state/auth.actions';

@Component({
  selector: 'app-header',
  imports: [CommonModule, NgIconsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class HeaderComponent {
  private readonly store = inject(Store);

  isMenuOpen: boolean = false;

  user$: Observable<User | null> = this.store.select(UserState.getItem);

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.store.dispatch(new AuthAction.Logout);
  }
}
