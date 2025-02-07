import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconsModule } from '@ng-icons/core';
import { Store } from '@ngxs/store';
import { AuthAction } from '../../state/auth.actions';
import { AuthState } from '../../state/auth.state';
import { NotificationService } from '@shared/services/notification.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, NgIconsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly notificationService = inject(NotificationService)

  myForm!: FormGroup;

  constructor() {
    this.myForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    })

    this.store.select(AuthState.getError).subscribe(error => {
      console.log('Constructor error', error)
      if(error)
        this.notificationService.show([error], 'error');
    })
  }

  onSubmit() {
    if(this.myForm.valid) {
      const { email, password } = this.myForm.getRawValue();
      this.store.dispatch(new AuthAction.Login(email, password));
    } else {
      this.myForm.markAllAsTouched();
    }
  }
}
