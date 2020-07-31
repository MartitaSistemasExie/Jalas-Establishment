import { Component, OnInit } from '@angular/core';
import {Camera, CameraOptions} from "@ionic-native/camera/ngx";
import {AlertController, LoadingController} from "@ionic/angular";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from "@ionic-native/native-geocoder/ngx";
import {Storage} from "@ionic/storage";
import {HTTP} from "@ionic-native/http/ngx";
import {environment} from "../../../../environments/environment.prod";
import {Router} from "@angular/router";
import { DatePipe } from '@angular/common';

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  addresDis = true;
  serviceRes;
  event = {
    name: '',
    latitude: 0,
    longitude: 0,
    idEstablishment: '',
    conf: {
      address: '',
      description: '',
      date: {
        horaInicio: '',
        horaFin: '',
        fechaInicio: '',
        fechaFin: '',
      },
      images: {
        bannerImage: ''
      }
    }
  };
  bannerImage = '';
  name = '';
  address = '';
  description = '';
  fechaInicio = '';
  horaInicio = '';
  fechaFin = '';
  horaFin = '';
  idEstablishment;

  constructor(private alertController: AlertController,
              private camera: Camera,
              private datePipe: DatePipe,
              private http: HTTP,
              private loadingController: LoadingController,
              private nativeGeocoder: NativeGeocoder,
              private geolocation: Geolocation,
              private router: Router,
              private storage: Storage) { }

  ngOnInit() {
    this.getSavedID();
  }

  ionViewWillEnter() {
    console.log('DID ENTER');
    this.bannerImage = '';
    this.name = '';
    this.address = '';
    this.description = '';
    this.fechaInicio = '';
    this.horaInicio = '';
    this.fechaFin = '';
    this.horaFin = '';
  }


  /***
   * Create Event
   */
  createEvent() {
    const valid = this.validateData();
    if (!valid) {
      this.presentErrorFields();
      return;
    }
    this.fillData();
  }


  /***
   * Validate Data
   */
  validateData() {
    let valid = false;
    if (this.name == '' || this.bannerImage == '' || this.address == '' || this.description == '' || this.fechaFin == '' || this.horaFin == '' || this.fechaInicio == ''  || this.horaInicio == '') {
      return valid;
    }
    valid = true;
    return valid;

  }

  /***
   * Fill Data
   */
  fillData() {
    console.log('Hora Inicio', this.horaInicio.split(".",1)[0].split("T", 2)[1]);
    this.event.name = this.name;
    this.event.idEstablishment = this.idEstablishment;
    this.event.conf.images.bannerImage = this.bannerImage;
    this.event.conf.address = this.address;
    this.event.conf.description = this.description;
    this.event.conf.date.fechaInicio = this.datePipe.transform(this.fechaInicio, 'dd-MM-yyyy');
    this.event.conf.date.fechaFin = this.datePipe.transform(this.fechaFin, 'dd-MM-yyyy');
    this.event.conf.date.horaInicio = this.datePipe.transform(this.horaInicio, 'HH:mm');
    this.event.conf.date.horaFin = this.datePipe.transform(this.horaFin, 'HH:mm');
    console.log('EVENT:', this.event);
    this.callCreateService();

  }


  /***
   * Call Create Service
   */
  callCreateService() {
    this.presentLoading();
    const service = 'events/createEvent';
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data: this.event}, {}).then(resp => {
      this.loadingController.dismiss();
      console.log('RESP SERVICIO:');
      console.log(resp.data);
      this.serviceRes = JSON.parse(resp.data);
      if(this.serviceRes.status != 0) {
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
   * presentServiceError Alert
   */
  async presentServiceSuccess() {
    const alert = await this.alertController.create({
      header: 'Listo',
      subHeader: 'Evento creado correctamente.',
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.router.navigate(['/main-tabs']);
        }
      }]
    });
    await alert.present();
    return;
  }

  /***
   * Get Saved ID
   */
  async getSavedID() {
    await this.storage.get('siteID').then((value => {
      this.idEstablishment = value;
      console.log('ID: ', this.idEstablishment);
    }));
  }


  /***
   * Add Banner Image
   */
  addBannerImage() {
    const options: CameraOptions = {
      quality: 5,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    };
    console.log('CAMERA OPTS: ', options);
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log('Image DATA', imageData);
      this.bannerImage = 'data:image/jpeg;base64,' + imageData;
      console.log('SELECTED BANNER', this.bannerImage);
    }, (err) => {
      // Handle error
    });

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
      this.event.latitude = resp.coords.latitude;
      this.event.longitude = resp.coords.longitude;
      console.log('LAT: ', this.event.latitude, ' AND LONG: ', this.event.longitude);

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
  setLocationString() {
    this.addresDis = false;
    //
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(this.event.latitude, this.event.longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        console.log('STRING RES:');
        console.log(result[0]);
        this.address = result[0].thoroughfare + ' #' + result[0].subThoroughfare + ', ' + result[0].subLocality + '. ' + result[0].locality + ', ' + result[0].administrativeArea;
      })
      .catch((error: any) => console.log(error));
    // this.addressString = 'Mier y Noriega 413, locality, 67100 Monterrey, N.L.';
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
   * PresentError Fields
   */
  async presentErrorFields() {
    const alert = await this.alertController.create({
      subHeader: 'Error',
      message: ' Debes llenar todos los campos. ',
      buttons: ['Ok']
    });
    await alert.present();
  }

  /***
   * Present Loaging
   */
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Espera por favor...'
    });
    await loading.present();
  }

}
