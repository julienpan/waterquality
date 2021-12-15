import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Platform, MenuController } from '@ionic/angular';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  phRef: AngularFirestoreCollection<any>;
  ph: Observable<any>;

  filesizeRef: AngularFirestoreCollection<any>;
  filesize: Observable<any>;

  size: any;

  phValue : any;
  value: any;

  exactValue: any;

  date: any;

  tabValue = [];

  anotherValue: boolean = false;
  show: boolean = false;

  draftList = [];
  exactDraftList = [];

  constructor(
    private platform: Platform,
    private menu: MenuController,
    public firestore: AngularFirestore,
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit() {

    this.date = moment().utc().add(1, 'hours').format('LL LTS')
    console.log(this.date);

    this.phRef = this.firestore.collection('phData');
    this.ph = this.phRef.valueChanges();
    this.ph.forEach(r => {
      // console.log('DATA : ',r);
      if(r.length == 0) {
        console.log('VIDE');
        this.exactValue = 0;
      }
    })
    this.checkDB();
    this.getDraftList();

  }

  checkDB() {

    this.filesizeRef = this.firestore.collection('filesize');
    this.filesize = this.filesizeRef.valueChanges();

    this.http.get('assets/arduino/phData.txt', {
      responseType: 'text',
    }).subscribe(r => {
      this.size = r.length;
      console.log(this.size);
      this.filesizeRef.ref.get().then(r => {
        r.forEach(r2 => {
          r2.ref.delete();
        })
      }).then(() => {
        this.filesizeRef.add({
          size: this.size,
        })
      })
    })

    this.filesize.forEach(r => {
      r.forEach(r2 => {
        if(r2.size != this.size) {
          this.anotherValue = false;
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
        } else {
          this.anotherValue = true;
        }
      })
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
          this.phRef = this.firestore.collection('phData');
          this.phRef.add({
            value: r,
            date: this.date.toString()
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
      this.value = r;
      // console.log('VALUE : ', this.value);
      this.value.forEach(r2 => {
        this.exactValue = r2.value
      })
    })
    this.addDraftData();
  }

  addDraftData() {
    const phRef = this.firestore.collection('phData');
    const ph = phRef.valueChanges();
    ph.forEach(r => {
      r.forEach(r2 => {
        // console.log(r2);
        if(!this.tabValue.includes(r2)) {
          this.tabValue.push(r2)
          const draftRef = this.firestore.collection('draft');
          draftRef.doc(this.tabValue[0].date).set({
            value: this.tabValue[0]
          })
        }
      })
    })
  }

  getDraftList() {

    const draftRef = this.firestore.collection('draft').valueChanges().pipe(take(1));
    draftRef.forEach(r => {
      r.forEach(r2 => {
        this.draftList.push(r2);
      })
    })
  }

  navigateToDraft() {
    this.router.navigateByUrl('/home/draft', {
      state: {
        draftList: this.draftList
      }
    })
  }
}
