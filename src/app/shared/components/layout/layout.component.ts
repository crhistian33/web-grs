import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavLeftComponent } from '../nav-left/nav-left.component';
import { HeaderComponent } from '../header/header.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { LoadingComponent } from '../loading/loading.component';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, NavLeftComponent, HeaderComponent, BreadcrumbComponent, LoadingComponent, NotificationComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {}
