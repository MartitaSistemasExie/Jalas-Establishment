import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController, LoadingController} from "@ionic/angular";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import {HTTP} from "@ionic-native/http/ngx";
import {Storage} from "@ionic/storage";
import {environment} from "../../../environments/environment.prod";

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-create-info',
  templateUrl: './create-info.page.html',
  styleUrls: ['./create-info.page.scss'],
})
export class CreateInfoPage implements OnInit {
  /***
   * Dev Variables;
   */
  phone = '811234321';
  description = 'A simple BAR description';
  accountData: any;
  selectedCat;
  addressString = '';
  addresDis = true;

  monDis=true;
  mondF;
  monT;
  tueDis=true;
  tueF;
  tueT;
  wedDis=true;
  wedF;
  wedT;
  thuDis=true;
  thuF;
  thuT;
  friDis=true;
  friF;
  friT;
  satDis=true;
  satF;
  satT;
  sunDis=true;
  sunF;
  sunT;

  arrayDis=false;
  selectedMusic = 0;

  musicTypes = [
    {id: 0, name: 'Rock', isChecked: false},
    {id: 1, name: 'Reggaeton', isChecked: false},
    {id: 2, name: 'Banda', isChecked: false},
    {id: 3, name: 'Electronica', isChecked: false},
    {id: 4, name: 'Pop', isChecked: false},
    {id: 5, name: 'Jazz', isChecked: false},
    {id: 6, name: 'Ritmo Latinos', isChecked: false},
    {id: 7, name: 'Metal', isChecked: false},
    {id: 8, name: 'Reg. Mexicano', isChecked: false},
    {id: 9, name: 'Hip-Hop', isChecked: false},
    {id: 10, name: 'Reggae', isChecked: false},
    {id: 11, name: '80’s', isChecked: false},
    {id: 12, name: '90’s', isChecked: false},
    {id: 13, name: 'Disco', isChecked: false},
    {id: 14, name: 'Indie', isChecked: false}
  ];

  establishmentCats = [
    {id: 0, name: 'Bar'},
    {id: 14, name: 'Bar 🏳️‍🌈'},
    {id: 1, name: 'Terraza'},
    {id: 2, name: 'Antro'},
    {id: 3, name: 'Lugar Temático'},
    {id: 4, name: 'Comedia'},
    {id: 5, name: 'Sport Bar'},
    {id: 6, name: 'Gamer Bar'},
    {id: 7, name: 'Speak Easy'},
    {id: 8, name: 'Café'},
    {id: 9, name: 'Pub'},
    {id: 10, name: 'Tequileria'},
    {id: 11, name: 'Mezcaleria'},
    {id: 12, name: 'Pulqueria'},
    {id: 13, name: 'Lugares para Citas'},
  ];

  data = {
    name: '',
    email: '',
    password: '',
    phone: '',
    group: '',
    conf: {
      genres: [],
      description: '',
      category: [],
      location: {
        latitude: 0,
        longitude: 0,
        address: ''
      },
      hours: {
        lunes: '',
        martes: '',
        miercoles: '',
        jueves: '',
        viernes: '',
        sabado: '',
        domingo: '',
      }
    }
  };

  noHourSelected = true;
  serviceResponse;
  idEstablishment;

  constructor(private alertController:AlertController,
              private geolocation: Geolocation,
              private http: HTTP,
              private loadingController: LoadingController,
              private nativeGeocoder: NativeGeocoder,
              private route: ActivatedRoute,
              private router: Router,
              private storage: Storage) {
    this.route.queryParams.subscribe(params => {
      if (params && params.user) {
        console.log('params: ', params.user);
        this.accountData = JSON.parse(params.user);
      }
    });
  }

  ngOnInit() {
  }

  /***
   * Create Establishment Info
   */
  createEstablishmentInfo() {

    this.fillData();
    if(this.noHourSelected || this.selectedCat == undefined || this.addressString == '' || this.phone == undefined || this.description == '' || this.selectedMusic == 0) {
      this.presentEmptyAlert();
      return;
    }
    console.log('DATA', this.data);
    this.presentLoading();
    const service = 'establishments/createEstablishment';
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data: this.data}, {}).then(resp => {
      this.loadingController.dismiss();
      console.log('RESP SERVICIO:');
      console.log(resp.data);
      this.serviceResponse = JSON.parse(resp.data);
      if(this.serviceResponse.status == 0) {
        this.presentServiceError();
        return;
      }
      this.idEstablishment = this.serviceResponse.idEstablishment;
      this.saveSiteId();
    }).catch(error => {
      console.log('ERROR: ', error);
      this.presentServiceError();
      return;
    })

    // const dataToString = {
    //   data: this.data
    // };
    //
    // console.log('Creating Establishment Data:', dataToString);
    // this.siteService.createEstablishment(JSON.stringify(dataToString)).subscribe(resp => {
    //   console.log('Service Resp:', resp);
    //   this.loadingController.dismiss();
    //   this.serviceResponse = resp;
    //   if(this.serviceResponse.status == 0) {
    //     this.presentServiceError();
    //     return;
    //   }
    //   this.idEstablishment = this.serviceResponse.idEstablishment;
    //   this.saveSiteId();
    // });

  }

  /***
   * Fill Data
   */
  fillData() {
    // nombre
    this.data.name = this.accountData.name;

    // mail
    this.data.email = this.accountData.email;

    // grupo
    this.data.group = 'none';
    // contrasena
    this.data.password = this.accountData.pswd;

    // categoria
    this.data.conf.category.push(Number(this.selectedCat));

    // ubicacion
    this.data.conf.location.address = this.addressString;
    this.data.conf.location.latitude = this.accountData.latitude;
    this.data.conf.location.longitude = this.accountData.longitude;

    // telefono
    this.data.phone = this.phone;


    // descripcion
    this.data.conf.description = this.description;

    // horarios
    this.fillHours();

    // generos
    this.fillGeneres();
  }

  /***
   * Fill Hours
   */
  fillHours() {
    console.log('MON:', this.monDis);
    console.log('TUE:', this.tueDis);
    console.log('WED:', this.wedDis);
    console.log('THU:', this.thuDis);
    console.log('FRI:', this.friDis);
    console.log('SAT:', this.satDis);
    console.log('SUN:', this.sunDis);
    if (this.monDis) {
      this.data.conf.hours.lunes = ' Cerrado ';
    } else {
      this.data.conf.hours.lunes = this.mondF.substring(11,16) + ' - ' + this.monT.substring(11,16);
      this.noHourSelected = false;
    }

    if (this.tueDis) {
      this.data.conf.hours.martes = ' Cerrado ';
    } else {
      this.data.conf.hours.martes = this.tueF.substring(11,16) + ' - ' + this.tueT.substring(11,16);
      this.noHourSelected = false;
    }

    if (this.wedDis) {
      this.data.conf.hours.miercoles = ' Cerrado ';
    } else {
      this.data.conf.hours.miercoles = this.wedF.substring(11,16) + ' - ' + this.wedT.substring(11,16);
      this.noHourSelected = false;
    }

    if (this.thuDis) {
      this.data.conf.hours.jueves = ' Cerrado ';
    } else {
      this.data.conf.hours.jueves = this.thuF.substring(11,16) + ' - ' + this.thuT.substring(11,16);
      this.noHourSelected = false;
    }

    if (this.friDis) {
      this.data.conf.hours.viernes = ' Cerrado ';
    } else {
      this.data.conf.hours.viernes = this.friF.substring(11,16) + ' - ' + this.friT.substring(11,16);
      this.noHourSelected = false;
    }

    if (this.satDis) {
      this.data.conf.hours.sabado = ' Cerrado ';
    } else {
      this.data.conf.hours.sabado = this.satF.substring(11,16) + ' - ' + this.satT.substring(11,16);
      this.noHourSelected = false;
    }

    if (this.sunDis) {
      this.data.conf.hours.domingo = ' Cerrado ';
    } else {
      this.data.conf.hours.domingo = this.sunF.substring(11,16) + ' - ' + this.sunT.substring(11,16);
      this.noHourSelected = false;
    }
  }

  /***
   * Fill Generes
   */
  fillGeneres() {
    for (const v in this.musicTypes) {
      if (this.musicTypes[v].isChecked) {
        this.data.conf.genres.push(this.musicTypes[v].id);
      }
    }
  }


  /***
   * Save Site Id
   */
  async saveSiteId() {
    await this.storage.set('siteID', this.idEstablishment).then( () => {
      console.log('SAVED SITE ID');
      this.goToWelcomeScreen();
    });

  }

  /***
   * Go To Welcome Screen
   */
  goToWelcomeScreen() {
    this.router.navigate(['/welcome']);
  }


  /***
   * Check Music Types
   */
  checkMusicType(type: any) {

    if (this.selectedMusic == 0){
      this.presentWarningMusicAlert();
    }

    if(type.isChecked) {
      console.log('Tipo de musica YA CHECADO');
      type.isChecked = false;
      this.selectedMusic -= 1;
      return;
    }

    if (!type.isChecked) {
      console.log('Tipo de musica NO CHECADO');
      if (this.selectedMusic < 3) {
        console.log('Musica < 3, checar elemento y aumentar musica');
        type.isChecked = true;
        this.selectedMusic += 1;

        if (this.selectedMusic == 3) {
          this.presentMaxGeneresAlert();
          this.arrayDis = true;
        }
      }
    }

    console.log('Numero: ', this.selectedMusic);

  }

  /***
   * Obtener Direccion
   */
  async obtenerDireccion() {
    const alert = await this.alertController.create({
      header: 'Obtener Ubicación',
      message: 'Utilizar ubicación actual?',
      buttons: [
        {
          text: 'Cancel',
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
      this.accountData.latitude = resp.coords.latitude;
      this.accountData.longitude = resp.coords.longitude;
      console.log('LAT: ', this.accountData.latitude, ' AND LONG: ', this.accountData.longitude);

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

    this.nativeGeocoder.reverseGeocode(this.accountData.latitude, this.accountData.longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        console.log('STRING RES:');
        console.log(result[0]);
        this.addressString = result[0].thoroughfare + ' #' + result[0].subThoroughfare + ', ' + result[0].subLocality + '. ' + result[0].locality + ', ' + result[0].administrativeArea;
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
   * Present Warning Music Alert
   */
  async presentWarningMusicAlert() {
    const alert = await this.alertController.create({
      header: 'Cuidado!',
      subHeader: 'Máx. 3 Géneros',
      message: 'Al llegar a los 3 géneros, se deshabilitarán y no podrás cambiarlo',
      buttons: ['Ok']
    });
    await alert.present();
    return;
  }

  /***
   * Present Max Generes Alert
   */
  async presentMaxGeneresAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Máximo de Géneros Alcanzado',
      message: '',
      buttons: ['Ok']
    });
    await alert.present();
    return;
  }


  /***
   * Present Empty Alert
   */
  async presentEmptyAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Debes llenar todos los campos!.',
      message: '',
      buttons: ['Ok']
    });
    await alert.present();
    return;
  }

  /***
   * presentServiceError Alert
   */
  async presentServiceError() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Verifica tu internet e intentalo de nuevo.',
      buttons: [ {
        text: 'OK',
        handler: () => {
          this.router.navigate(['/login']);
        }
      }]
    });
    await alert.present();
    return;
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
