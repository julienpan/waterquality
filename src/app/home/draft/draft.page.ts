import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.page.html',
  styleUrls: ['./draft.page.scss'],
})
export class DraftPage implements OnInit {

  draftList: any;

  date: any;
  showSecond: boolean = false;

  secondDraftList: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {

    this.date = moment().utc().add(1, 'hours');
    console.log(this.showSecond);
    this.draftList = history.state.draftList != null ? history.state.draftList : null;
    console.log(this.draftList);
    if(this.draftList == null) {
      this.router.navigateByUrl('/home');
    }
  }

  changeDate(event) {
    console.log(event);
    this.secondDraftList = [];
    this.draftList.forEach(r => {
      console.log(r);
      if(r.value.date.substring(14, 18) == event.detail.value.substring(0, 4) 
      && r.value.date.substring(9, 11) == event.detail.value.substring(8, 10)
      // && r.value.date.substring()
      ) {
        this.secondDraftList.push(r);
      }
    })
    if(this.secondDraftList.length == 0) {
      this.showSecond = true;
      console.log(this.secondDraftList, this.showSecond);

    } else {
      this.showSecond = false;
      console.log(this.secondDraftList, this.showSecond);
    }
  }
}
