import { CommonModule, Location } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIconsModule } from '@ng-icons/core';

@Component({
  selector: 'app-title-page',
  imports: [CommonModule, RouterLink, NgIconsModule],
  templateUrl: './title-page.component.html',
  styleUrl: './title-page.component.scss'
})
export class TitlePageComponent {
  location = inject(Location);
  router = inject(Router);

  @Input() title!: string;
  @Input() page!: string;
  @Input() numTrashed!: number;
  @Input() fallbackUrl = '/';

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate([this.fallbackUrl]);
    }
  }
}
