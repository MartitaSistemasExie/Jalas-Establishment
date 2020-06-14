import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Storage} from "@ionic/storage";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  hasSeenSlides;
  constructor(
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.checkSlides();
  }

  /***
   * Check Slides
   */
  async checkSlides() {
    await this.storage.get('slides').then(value => {
      this.hasSeenSlides = value;
      console.log('SLIDES: ', this.hasSeenSlides);
      this.initializeApp();
    });
  }

  /***
   * Initialize App
   */
  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (this.hasSeenSlides) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/home']);
      }

    });
  }
}
