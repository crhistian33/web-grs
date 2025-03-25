import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TypeWorker } from '@models/type-worker.model';
import { NgIconsModule } from '@ng-icons/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { Store } from '@ngxs/store';
import { NotificationService } from '@shared/services/notification.service';
import { MESSAGES } from '@shared/utils/constants';
import { AssistActions } from '@state/assist/assist.actions';
import { UserState } from '@state/user/user.state';

@Component({
  selector: 'app-filter-date',
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, NgIconsModule, RouterLink],
  templateUrl: './filter-date.component.html',
  styleUrl: './filter-date.component.scss'
})
export class FilterDateComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  @Output() filterDate = new EventEmitter<{ date_from: string, date_to: string, companyId: number | null }>();
  @Input() route!: string;
  @Input() labelRoute!: string;
  companyId!: number;
  myForm: FormGroup = this.fb.group({
    date_from: ['', Validators.required],
    date_to: ['', Validators.required],
  })

  ngOnInit(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.myForm.patchValue({
      date_from: firstDay.toISOString().split('T')[0],
      date_to: today.toISOString().split('T')[0],
    });
    const companies = this.store.selectSnapshot(UserState.getCurrentUserCompanies);
    if(companies && companies.length === 1) {
      this.companyId = companies[0].id;
    }
    this.onSubmit();
  }

  onSubmit() {
    if(this.myForm.valid) {
      const { date_from, date_to } = this.myForm.value;
      if(date_from > date_to) {
        this.notificationService.show([MESSAGES.INVALID_RANGE_DATE], 'error');
      }
      else {
        const emitValue = this.companyId
          ? { date_from , date_to, companyId: this.companyId }
          : { date_from , date_to, companyId: null };

        this.filterDate.emit(emitValue);
      }
    } else {
      this.notificationService.show([MESSAGES.INVALID_SUBMIT_FILTER_DATE], 'error');
    }
  }
}
