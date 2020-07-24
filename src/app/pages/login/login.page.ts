import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController} from '@ionic/angular';
import {HTTP} from '@ionic-native/http/ngx';
import {environment} from '../../../environments/environment.prod';
import {Storage} from "@ionic/storage";
import {Router} from "@angular/router";

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  /***
   * DEV VARIABLES
   */
  usuario = {
    email: '',
    pswd: ''
  };

  /***
   * PROD VARIABLES
   */
    // usuario = {
    //   email: '',
    //   pswd: ''
    // };
  //  Other Variables
  private serviceResponse;

  constructor(private alertController: AlertController,
              private http: HTTP,
              private loadingController: LoadingController,
              private router: Router,
              private storage: Storage) { }

  ngOnInit() {
  }

  /***
   * Do Login
   */
  doLogin() {
    if (this.usuario.email === '' || this.usuario.pswd === '') {
      this.presentEmptyFieldsAlert();
    }
    const data = {
      email: this.usuario.email,
      password: this.usuario.pswd
    };

    console.log('Login DATA: ', data);
    console.log('JSON: ', JSON.stringify(data));
    this.presentLoading();
    const service = 'login/validateCredentials';
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {
      data: data
    }, {}).then(async resp => {
     await this.loadingController.dismiss();
      console.log('RESP ON SERVICE:', JSON.parse(resp.data));
      this.serviceResponse = JSON.parse(resp.data);
      if (this.serviceResponse.status === 0 || this.serviceResponse.type === 'user') {
        console.log('USER OR INVALID');
        this.presentInvalidUserAlert();
        return;
      }

      if ( this.serviceResponse.type === 'establishment') {
        console.log('GOING TO establishment TABS');
        // this.saveSiteID(this.serviceResponse.data);
        this.saveSiteID(this.serviceResponse.data, this.serviceResponse.idSession);
        // this.router.navigate(['/site-tabs']);
      }
    }).catch(error => {
      console.log('ERROR ON SERVICE:', error);
    });
  }

  /***
   * Save Site ID
   */
  async saveSiteID(id, session) {
    await this.storage.set('siteID', id).then(() => {
      this.storage.set('session', session).then( () => {
        this.router.navigate(['/main-tabs']);
      });
    });
  }

  /***
   * Present Empty Fields Alert
   */
  async presentEmptyFieldsAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Debes llenar todos los campos',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  /***
   * Present Invalid User Alert
   */
  async presentInvalidUserAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Usuario incorrecto',
      message: 'Revisa tus credenciales e intenta de nuevo.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }


  /***
   * Present Loading
   */
  async presentLoading() {
    const loader = await this.loadingController.create({
      message: ' Espera Por favor...',
    });
    await loader.present();
  }

}
