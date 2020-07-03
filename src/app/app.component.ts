import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Storage} from "@ionic/storage";
import {Router} from "@angular/router";
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from '../environments/environment.prod';

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  hasSeenSlides;
  session;
  idUser;
  serviceResponse;
  constructor(
    private platform: Platform,
    private router: Router,
    private http: HTTP,
    private storage: Storage,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    // this.checkSlides();
    this.getSavedSession();
  }


  async getSavedSession() {
    console.log('GET SAVED SESSION:');
    await this.storage.get('session').then(val => {
      this.session = val;
      this.initializeApp();
    });
  }


  initializeApp() {
    console.log('Init App');
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();


      if (this.session == undefined || this.session == null) {
        console.log('Session undefined or null');
        this.checkSlides();
      } else {
        console.log('Session saved');
        this.getUser();
      }
    });
  }


  async checkSlides() {
    console.log('Check slides');
    await this.storage.get('slides').then(value => {
      this.hasSeenSlides = value;
      console.log('slides', this.hasSeenSlides);
      if (this.hasSeenSlides) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  async getUser() {
    await this.storage.get('siteID').then(val => {
      this.idUser = val;
      this.verifySession();
    });
  }

  verifySession() {
    const service = 'login/verifyEstablishmentSession';
    this.http.setDataSerializer('json');
    const data = {
      idEstablishment: this.idUser,
      idSession: this.session
    };

    this.http.post(urlBack + service, {
      data: data
    }, {}).then(async resp => {
     console.log('RESP ON SERVICE:', resp);
     this.serviceResponse = resp;

     if (this.serviceResponse.status == 0) {
      this.router.navigate(['/login']);
     } else {
       this.router.navigate(['/main-tabs']);
     }
    }).catch(error => {
      console.log('ERROR ON SERVICE:', error);
    });
  }
}
