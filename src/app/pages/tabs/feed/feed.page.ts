import { Component, OnInit } from '@angular/core';
import {Storage} from "@ionic/storage";
import {LoadingController} from "@ionic/angular";
import {HTTP} from "@ionic-native/http/ngx";
import {environment} from "../../../../environments/environment.prod";

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  serviceResp;
  idEstablishment;
  events;
  noEvents = true;
  constructor(private http: HTTP,
              private loadingController: LoadingController,
              private storage: Storage) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getSavedID();
  }

  /***
   * Get Saved ID
   */
   async getSavedID() {
    await this.storage.get('siteID').then((value => {
      this.idEstablishment = value;
      console.log('ID: ', this.idEstablishment);
      this.getEstablishmentEvents();
    }));
  }


  /***
   * getEstablishmentEvents
   */
  getEstablishmentEvents() {

    this.presentLoading();
    const service = 'establishments/getEvents';
    const data = {
      idEstablishment: this.idEstablishment
    };

    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data: data}, {}).then(resp => {
      this.loadingController.dismiss();
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      this.fillEvents(this.serviceResp.data);
    }).catch(error => {
      console.log('ERROR: ', error);
    });

  }


  /***
   * Fill events
   */
  fillEvents(data) {
    this.events = data;
    // console.log('EVENTS DATA:', data);
    // for(let v in data){
    //   this.events.push(data[v]);
    // }
    if (this.events.length > 0 ) this.noEvents = false;
    console.log('EVENTS:', this.events[0].idevent);
  }



  /***
   * Present Loading
   */
  async presentLoading() {
    const loader = await this.loadingController.create({
      message: 'Espera por favor...'
    });
    return await loader.present();
  }

}
