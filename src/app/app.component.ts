import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MenuController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { snapshotChanges } from '@angular/fire/compat/database';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  constructor(
    private platform: Platform,
    private menu: MenuController,
    public firestore: AngularFirestore,
    private http: HttpClient,
    private router: Router,

  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('APP READY !');
    });
  }

}