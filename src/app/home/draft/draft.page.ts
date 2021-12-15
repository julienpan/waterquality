import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.page.html',
  styleUrls: ['./draft.page.scss'],
})
export class DraftPage implements OnInit {

  draftList: any;

  constructor() { }

  ngOnInit() {
    this.draftList = history.state.draftList != null ? history.state.draftList : [];
    console.log(this.draftList);
  }

}
