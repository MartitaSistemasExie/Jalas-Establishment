import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {HTTP} from "@ionic-native/http/ngx";
import {environment} from "../../../../environments/environment.prod";

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.page.html',
  styleUrls: ['./edit-password.page.scss'],
})
export class EditPasswordPage implements OnInit {

  idEstablishment;
  password;
  secondPswd;
  serviceResp;
  constructor(private alertController: AlertController,
              private http: HTTP,
              private modalController: ModalController,
              private storage: Storage) { }

  ngOnInit() {
    this.getSiteID();
  }

  /***
   * Update Password
   */
  updatePassword() {

    if (this.password != this.secondPswd) {
      this.passwordsAlert();
      return;
    }
    console.log('PSWD:', this.password);
    const service = 'establishments/updateEstablishmentPassword';
    const data = {
      idEstablishment: this.idEstablishment,
      password: this.password
    };

    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data:data}, {}).then(resp => {
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      if(this.serviceResp.status != 1) {
        this.errorAlert();
        return;
      }
      this.successAlert();
    }).catch(error => {
      console.log('ERROR: ', error);
    });

  }

  /***
   * Get Site ID
   */
  async getSiteID() {
    await this.storage.get('siteID').then((value => {
      this.idEstablishment = value;
      console.log('ID: ', this.idEstablishment);
    }));
  }

  /***
   * ErrorAlert
   */
  async errorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Verifica tu internet e intenta de nuevo.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.cerrarModal();
        }
      }]
    });
    await alert.present();
  }

  /***
   * Success Alert
   */
  async successAlert() {
    const alert = await this.alertController.create({
      header: 'Listo',
      message: 'Se ha modificado correctamente tu contraseña.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.cerrarModal();
        }
      }]
    });
    await alert.present();
  }

  /***
   * PasswordsAlert
   */
  async passwordsAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: ' Las contraseñas no coinciden.',
      buttons: ['OK']
    });
    await alert.present();
  }

  /***
   * Cerrar Modal
   */
  cerrarModal() {
    this.modalController.dismiss();
  }
}
