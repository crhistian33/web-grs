import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { NotificationComponent } from '@shared/components/notification/notification.component';

@Component({
  selector: 'app-layout-auth',
  imports: [RouterOutlet, LoadingComponent, NotificationComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutAuthComponent {

}
