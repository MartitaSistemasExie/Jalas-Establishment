import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController} from "@ionic/angular";
import {HTTP} from "@ionic-native/http/ngx";
import {environment} from '../../../environments/environment.prod';
import {NavigationExtras, Router} from "@angular/router";

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {
  /***
   * Prod Variables
   */
  establishment = {
    name: '',
    group: ' ',
    email: '',
    pswd: '',
  };
  secondPswd = '';
  /***
   * Dev Variables
   */
  // establishment = {
  //   name: 'Bar TEST',
  //   group: ' ',
  //   email: 'test1@jalas.com',
  //   pswd: 'test1',
  // };
  // secondPswd = 'test1';
  serviceResponse;
  constructor(private alertController: AlertController,
              private http: HTTP,
              private loadingController: LoadingController,
              private router: Router) { }

  ngOnInit() {
  }

  /***
   * Create Establishment
   */
  createEstablishment() {
    if (this.establishment.pswd !== this.secondPswd) {
      this.presentPasswordAlert();
    } else if (this.establishment.email === '' || this.establishment.name === '' || this.establishment.pswd === '') {
      this.presentEmptyAlert();
    } else {
      this.verifyEmail();
    }
  }


  /***
   * Verify Email
   */
  verifyEmail() {
    const data = {
      email: this.establishment.email
    };

    this.presentLoading();
    const service1 = 'establishments/verifyMail';
    const service2 = 'users/verifyMail';
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service1, {data: data}, {}).then(async resp => {
      await this.loadingController.dismiss();
      console.log('Establishment RESP: ', JSON.parse(resp.data));
      this.serviceResponse = JSON.parse(resp.data);
      if (this.serviceResponse.status === 1) {

        this.presentEmailAlert();
        return;
      }
      if (this.serviceResponse.status === 0) {
        this.http.post(urlBack + service2, {data: data}, {}).then(resp => {
          this.serviceResponse = JSON.parse(resp.data);
          console.log('USER RESP: ', this.serviceResponse);
          this.loadingController.dismiss();
          if (this.serviceResponse.status === 1 ){
            this.presentEmailAlert();
            return;
          }
          if ( this.serviceResponse.status === 0) {
            this.goToInfoScreen();
          }
        }).catch(error => {
          console.log('error: ', error);
        });
      }
    }).catch(error => {
      console.log('error: ', error);
    });
  }


  /***
   * Present Email Alert
   */
  async presentEmailAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Ya existe una cuenta con ese email.',
      buttons: [
        {
          text: 'Verificar',
          role: 'cancel',
          handler: () => {
            alert.dismiss();
          }
        },
        {
          text: 'Recuperar Contraseña',
          handler: () => {
            this.router.navigate(['/reset-password'])
          }
        }
      ]
    });

    await alert.present();
  }


  /***
   * Go To Info Screen:
   */
  goToInfoScreen() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        user: JSON.stringify(this.establishment)
      }
    };
    this.router.navigate(['/create-info'], navigationExtras);
  }


  /***
   * Present Password Alert:
   */
  async presentPasswordAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Las contraseñas no coinciden.',
      buttons: ['OK']
    });

    await alert.present();
  }


  /***
   * Present Empty Alert:
   */
  async presentEmptyAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Debes completar todos los campos.',
      buttons: ['OK']
    });

    await alert.present();
  }


  /***
   * Present Loading
   */
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Espera por favor...'
    });
    await loading.present();
    return ;
  }

}
