import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Assist } from '@models/assist.model';
import { StateWork } from '@models/state.model';
import { NgIconsModule } from '@ng-icons/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { Store } from '@ngxs/store';
import { CellValuePipe } from '@shared/pipes/cell-value.pipe';
import { AssistState } from '@state/assist/assist.state';
import { StateWorkAction } from '@state/state-work/state-work.actions';
import { StateWorkState } from '@state/state-work/state-work.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-update-assist',
  imports: [CommonModule, CellValuePipe, NgIconsModule, NgSelectModule],
  providers: [DatePipe],
  templateUrl: './update-assist.component.html',
  styleUrl: './update-assist.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        height: 0,
        opacity: 0
      })),
      transition('void => *', [
        animate('300ms ease-in-out', style({
          height: '*',
          opacity: 1
        }))
      ]),
      transition('* => void', [
        animate('300ms ease-in-out', style({
          height: 0,
          opacity: 0
        }))
      ])
    ])
  ]
})
export class UpdateAssistComponent implements OnInit {
  private readonly store = inject(Store);

  enabled = false;
  isState = false;
  isDate = false;
  isEditUnit = false;
  isEditWork = false;
  timeout!: any;
  assist$: Observable<Assist | null> = this.store.select(AssistState.getWorkerAssistDay);
  stateWorks$: Observable<StateWork[]> = this.store.select(StateWorkState.getItems);

  ngOnInit(): void {
    this.assist$.subscribe(data => {
      const inassit_id = data?.days[0].inassist_id;
      if(!inassit_id)
        this.changeState();
    });
    this.store.dispatch(new StateWorkAction.GetAll);
  }

  selectedState(event: Event) {
    const { type } = event;
    const typeNum = parseInt(type);

    if(typeNum === 1)
      this.changeUnit();
    else
      this.changeWork();
  }

  toggle() {
    this.enabled = !this.enabled;
  }

  changeState() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if(this.isDate){
      this.isDate = false;
      this.timeout = setTimeout(() => {
        this.isState = true;
      }, 300);
    } else {
      this.isState = true;
    }
  }

  changeDate() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if(this.isState){
      this.isState = false;
      this.timeout = setTimeout(() => {
        this.isDate = true;
      }, 300);
    } else {
      this.isDate = true;
    }
  }

  changeUnit() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if(this.isEditWork){
      this.isEditWork = false;
      this.timeout = setTimeout(() => {
        this.isEditUnit = true;
      }, 300);
    } else {
      this.isEditUnit = true;
    }
  }

  changeWork() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if(this.isEditUnit){
      this.isEditUnit = false;
      this.timeout = setTimeout(() => {
        this.isEditWork = true;
      }, 300);
    } else {
      this.isEditWork = true;
    }
  }
}
