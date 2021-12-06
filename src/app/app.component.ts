import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MenuController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { snapshotChanges } from '@angular/fire/compat/database';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  phRef: AngularFirestoreCollection<any>;
  ph: Observable<any>;

  phValue : any;
  value: any;

  exactValue: any;

  countValue: number = 0;

  count:any ;

  constructor(
    private platform: Platform,
    private menu: MenuController,
    public firestore: AngularFirestore,
    private http: HttpClient,

  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('APP READY !');
    });
  } 

  ngOnInit() {
    this.phRef = this.firestore.collection('phData');
    this.ph = this.phRef.valueChanges();
    this.ph.forEach(r => {
      console.log('DATA : ',r);
      if(r.length == 0) {
        console.log('VIDE');
        this.exactValue = 0;
      }
    })

    this.checkDB();
  }

  refresh() {
    console.log('refresh');
  }

  checkDB() {
    const ref = this.firestore.collection('phData').ref.get();
    ref.then((r) => {
      r.forEach(r2 => {
        // console.log(r2);
        r2.ref.delete();
      })
    }).then(() => {
      this.addData('assets/arduino/phData.txt');
    }).catch(e => {
      console.log(e);
    })
  }

  addData(path) {
    this.http.get(path, {
      responseType: 'text',
    }).subscribe((data) => {
      var regex = /\d+(\.\d+)?/g;
      var matches = data.match(regex);
      // console.log('Data file: ', data);
      this.phValue = data;
      // console.log(this.phValue);
      this.phValue = this.phValue.toString();
      if(matches) {
        matches.forEach(r => {
          // console.log(r);
          this.phRef = this.firestore.collection('phData');
          this.phRef.add({
            value: r
          })
        })
      }
    })
    this.getData();
  }

  getData() {
    // console.log('GET DATA FROM phData.txt : ');
    this.phRef = this.firestore.collection('phData');
    this.ph = this.phRef.valueChanges();
    this.ph.forEach(r => {
      // console.log(r);
      this.value = r;
      // console.log('VALUE : ', this.value);
      this.value.forEach(r2 => {
        this.exactValue = r2.value
      })
    })
  }

}
