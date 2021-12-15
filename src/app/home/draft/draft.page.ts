import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.page.html',
  styleUrls: ['./draft.page.scss'],
})
export class DraftPage implements OnInit {

  draftList: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {

    this.draftList = history.state.draftList != null ? history.state.draftList : null;
    console.log(this.draftList);
    if(this.draftList == null) {
      this.router.navigateByUrl('/home');
    }
  }

}
