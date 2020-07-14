import { Component, OnInit } from '@angular/core';
import {HTTP} from "@ionic-native/http/ngx";
import {AlertController, LoadingController, ModalController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {environment} from "../../../../environments/environment.prod";
import {Router} from "@angular/router";
import {EventDetailPage} from "../../modals/event-detail/event-detail.page";
import {EditEventPage} from "../../modals/edit-event/edit-event.page";

const urlBack = environment.urlBackend;

@Component({
  selector: 'app-event-feed',
  templateUrl: './event-feed.page.html',
  styleUrls: ['./event-feed.page.scss'],
})
export class EventFeedPage implements OnInit {

  profileServer = environment.establishmentImg + 'profile/';
  bannerServer = environment.establishmentImg  + 'banner/';
  galleryServer = environment.establishmentImg + 'gallery/';
  eventBanner = environment.eventImg + 'banner/';
  // profileServer = urlBack + '/images/establishment/profile/';
  // bannerServer = urlBack + '/images/establishment/banner/';
  // galleryServer = urlBack + '/images/establishment/gallery/';
  selectedCat;
  serviceResp;
  idEstablishment;
  events;
  noEvents = true;
  constructor(private alertController: AlertController,
              private http: HTTP,
              private loadingController: LoadingController,
              private modalController: ModalController,
              private router : Router,
              private storage: Storage) {
    console.log('ENTERED Constructor');

  }
  // constructor() { }

  ngOnInit() {
  }



  ionViewWillEnter() {
    console.log('ENTERED ION VIEW WILL ENTER');
    this.events = [];
    this.getSavedID();
  }


  /***
   * Edit Event
   */
  async editEvent(id){
    console.log('Edit Event:',id);
    await this.storage.set('eventID', id);
    const modal = await this.modalController.create({
      component: EditEventPage
    });
    modal.onDidDismiss().then(() => {
      this.getSavedID();
    });
    return await modal.present();
  }

  /***
   * Edit Event
   */
  async eventDetail(id){
    console.log('Edit Event:',id);
    await this.storage.set('eventID', id);
    const modal = await this.modalController.create({
      component: EventDetailPage
    });
    modal.onDidDismiss().then(() => {
      this.getSavedID();
    });
    return await modal.present();
  }

  /***
   * deleteEvent
   */
  async deleteEvent(id){

    const alert = await this.alertController.create({
      header: 'Estas seguro de borrar este evento?',
      message: 'No podrás recuperar este evento',
      buttons: [{
        text: 'Cancelar',
        handler: () => {
          console.log('CANCELED');
        }
      },
        {
          text: 'Borrar',
          handler: () => {
            this.callDeleteService(id);
          }
        }]
    });
    await alert.present();
  }


  /***
   * Call Delete Service
   */
  callDeleteService(id) {
    console.log('delete Event:',id);
    const service = 'events/deleteEvent';
    const data = {
      idEvent: id
    };

    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data: data}, {}).then(resp => {
      console.log('SERVICE RESP');
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      if(this.serviceResp.status != 1) {
        this.serviceError();
        return;
      }
      this.serviceSuccess();

    }).catch(error => {
      console.log('ERROR: ', error);
    });
  }

  /***
   * Service Success
   */
  async serviceSuccess() {
    const alert = await this.alertController.create({
      header: 'Listo!',
      message: ' Evento Borrado',
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.getSavedID();
        }
      }]
    });
    await alert.present();
  }

  /***
   * Service Error
   */
  async serviceError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Verifica tu internet e intenta más tarde.',
      buttons: ['Ok']
    });
    await alert.present();
  }

  /***
   * Get Saved ID
   */
   async getSavedID() {
     console.log('Entered SavedID;');
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
    console.log('Entered GET ESTABLISHMENT EVENTS');
    // this.presentLoading();
    const service = 'establishments/getEvents';
    const data = {
      idEstablishment: this.idEstablishment
    };

    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data: data}, {}).then(resp => {
      console.log('SERVICE RESP');

      // this.loadingController.dismiss();
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
    console.log('ENTERED FILL EVENT');
    this.events = data;
    if (this.events.length > 0 ) this.noEvents = false;
    console.log('EVENTS:', this.events.length);
  }



  /***
   * Present Loading
   */
  async presentLoading() {
    console.log('ENTERED PRESENT LOADING');
    const loader = await this.loadingController.create({
      message: 'Espera por favor...'
    });
    return await loader.present();
  }

}
