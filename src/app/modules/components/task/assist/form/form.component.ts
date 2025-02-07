import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIconsModule } from '@ng-icons/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NavfloatComponent } from '@shared/components/navfloat/navfloat.component';

@Component({
  selector: 'app-form',
  imports: [CommonModule, NgSelectModule, NgIconsModule, NavfloatComponent],
templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {

}
