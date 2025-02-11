import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconsModule } from '@ng-icons/core';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
  selector: 'app-nav-left',
  imports: [RouterLink, RouterLinkActive, NgIconsModule, TooltipComponent],
  templateUrl: './nav-left.component.html',
  styleUrl: './nav-left.component.scss'
})
export class NavLeftComponent {

}
