import { Component, OnInit } from '@angular/core';
import {HTTP} from "@ionic-native/http/ngx";
import {AlertController, LoadingController, ModalController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {environment} from "../../../../environments/environment.prod";

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

   serviceResp;
   bannerImage;
   idEvent;
   name;
   address;
   description;
   fechaInicio;
   fechaFin;
   horaInicio;
   horaFin;
   bannerServer = environment.eventImg + 'banner/';
  // bannerServer = urlBack + '/images/event/banner/';
  //   banner

  constructor(private alertController: AlertController,
              private http: HTTP,
              private loadingController: LoadingController,
              private modalController: ModalController,
              private storage: Storage) { }

  ngOnInit() {
    this.getEventID();
  }

  /***
   * Get Event ID
   */
  async getEventID() {
    await this.storage.get('eventID').then(value => {
      this.idEvent = value;
      this.getEventInfo();
    });
  }

  /***
   * Get Event Info
   */
  getEventInfo() {
    this.presentLoading();
    const service = 'events/getEventInfo';
    const data = {
      idEvent: this.idEvent
    };

    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data: data}, {}).then(resp => {
      this.loadingController.dismiss();
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      this.fillEvent(this.serviceResp.data);
    }).catch(error => {
      console.log('ERROR: ', error);
      this.presentServiceError();
    });
  }


  /***
   * Fill Event
   */
  fillEvent(event) {
    console.log('EVENT', event);
    this.name = event.name;
    this.address = event.conf.address;
    this.description = event.conf.description;
    this.fechaInicio = event.conf.date.fechaInicio;
    this.horaInicio = event.conf.date.horaInicio;
    this.fechaFin = event.conf.date.fechaFin;
    this.horaFin = event.conf.date.horaFin;
    this.bannerImage = this.bannerServer + event.conf.images.bannerImage + '.jpg';
  }


  /***
   * presentServiceError Alert
   */
  async presentServiceError() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Verifica tu internet e intentalo de nuevo.',
      buttons: ['Ok']
    });
    await alert.present();
    return;
  }

  /***
   * Cerrar Modal
   */
  async cerrarModal() {
    await this.storage.remove('eventID').then(() => {
      this.modalController.dismiss();
    })
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
