import {Component, OnInit} from '@angular/core';
import {Storage} from "@ionic/storage";
import {HTTP} from "@ionic-native/http/ngx";
import {AlertController, LoadingController, ModalController} from "@ionic/angular";
import {environment} from "../../../../environments/environment.prod";
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from "@ionic-native/native-geocoder/ngx";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import { DatePipe } from '@angular/common';

const urlBack = environment.urlBackend;

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {

  // bannerServer = urlBack + '/images/event/banner/';
  bannerServer = environment.eventImg + 'banner/';
  idEvent;
  serviceResp;
  //Editable fields
  name;
  latitude;
  longitude;
  bannerImage;
  address;
  description;
  fechaInicio;
  fechaFin;
  horaInicio;
  horaFin;
  idEstablishment;

  //Update obj
  data = {
    idEvent: '',
    name: '',
    latitude: 0,
    longitude: 0,
    idEstablishment: '',
    updateData: []
  };

  constructor(private alertController: AlertController,
              private geolocation: Geolocation,
              private http: HTTP,
              private datePipe: DatePipe,
              private loadingController: LoadingController,
              private modalController: ModalController,
              private nativeGeocoder: NativeGeocoder,
              private storage: Storage) {
  }

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
   * Upate Event
   */
  updateEvent() {
    this.data.idEvent = this.idEvent;
    this.data.name = this.name;
    this.data.latitude = this.latitude;
    this.data.longitude = this.longitude;
    this.data.idEstablishment = this.idEstablishment;
    //  address
    this.data.updateData.push({"field": "address", "data": this.address});
    console.log(this.data.updateData);
    //  description
    this.data.updateData.push({"field": "description", "data": this.description});
    //  fechas y horas
    this.data.updateData.push({
      "field": "date",
      "data": [
        "horaInicio", this.datePipe.transform(this.horaInicio, 'HH:mm'),
        "horaFin",this.datePipe.transform(this.horaFin, 'HH:mm'),
        "fechaInicio", this.datePipe.transform(this.fechaInicio, 'dd-MM-yyyy'),
        "fechaFin", this.datePipe.transform(this.fechaFin, 'dd-MM-yyyy')
      ]
    });

    console.log('DATA: ', this.data);
    this.callUpdateService();

  }

  /***
   * Call Update Service
   */
  callUpdateService() {
    this.presentLoading();
    const service = 'events/updateEvent';
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data: this.data}, {}).then(resp => {
      this.loadingController.dismiss();
      console.log('RESP SERVICIO UPDATE:');
      console.log(resp.data);
      this.serviceResp = JSON.parse(resp.data);
      if (this.serviceResp.status != 1) {
        this.presentServiceError();
        return;
      }
      this.presentServiceSuccess();
    }).catch(error => {
      console.log('ERROR: ', error);
      this.presentServiceError();
      return;
    })
  }


  /***
   * presentServiceError Alert
   */
  async presentServiceSuccess() {
    const alert = await this.alertController.create({
      header: 'Listo',
      subHeader: 'Evento editado correctamente.',
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.cerrarModal();
        }
      }]
    });
    await alert.present();
    return;
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
    });
  }

  /***
   * Fill Event
   */
  fillEvent(event) {
    console.log('EVENT', event);
    this.name = event.name;
    this.latitude = event.latitude;
    this.longitude = event.longitude;
    this.idEstablishment = event.idestablishment;

    console.log('idEstablishment from event', event.idestablishment);
    console.log('idEstablishment to update', this.idEstablishment);
    this.address = event.conf.address;
    this.description = event.conf.description;
    console.log('FECHA INICIO', event.conf.date.fechaInicio);
    console.log('FECHA INICIO TYPE', typeof (event.conf.date.fechaInicio));
    this.fechaInicio = event.conf.date.fechaInicio;
    this.horaInicio = event.conf.date.horaInicio;
    this.fechaFin = event.conf.date.fechaFin;
    this.horaFin = event.conf.date.horaFin;
    this.bannerImage = this.bannerServer + event.conf.images.bannerImage + '.jpg';
  }

  /***
   * Obtener Direccion
   */
  async obtenerDireccion() {
    const alert = await this.alertController.create({
      header: 'Obtener ubicación',
      message: '¿Utilizar ubicación actual?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancel Clicked!');
          }
        }, {
          text: 'Obtener',
          handler: () => {
            console.log('Confirm Okay clicked');
            this.getLatAndLong();
          }
        }
      ]
    });
    await alert.present();
  }


  /***
   * Get Latitude And Longitude | Geolication Native Plugin
   */
  getLatAndLong() {
    this.presentLoading();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.loadingController.dismiss();
      console.log('full Location Data: ', resp);
      // resp.coords.latitude
      // resp.coords.longitude
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      console.log('LAT: ', this.latitude, ' AND LONG: ', this.longitude);

      this.setLocationString();
    }).catch((error) => {
      this.loadingController.dismiss();
      console.log('Error getting location', error);
      this.presentLocationErrorAlert();
    });
  }


  /***
   * Set Location String
   */
  setLocationString() {//
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(this.latitude, this.longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        console.log('STRING RES:');
        console.log(result[0]);
        this.address = result[0].thoroughfare + ' #' + result[0].subThoroughfare + ', ' + result[0].subLocality + '. ' + result[0].locality + ', ' + result[0].administrativeArea;
      })
      .catch((error: any) => console.log(error));
    // this.addressString = 'Mier y Noriega 413, locality, 67100 Monterrey, N.L.';
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


  /***
   * Cerrar Modal
   */
  async cerrarModal() {
    await this.storage.remove('eventID').then(() => {
      this.modalController.dismiss();
    })
  }


  /***
   * Present Location Error Alert
   */
  async presentLocationErrorAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Ocurrió un error al obtener tu ubicación',
      message: ' Revisa tu internet y permisos e intenta de nuevo. ',
      buttons: ['Ok']
    });
    await alert.present();
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


}
