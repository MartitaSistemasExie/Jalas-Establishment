import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController, ModalController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {HTTP} from "@ionic-native/http/ngx";
import {environment} from "../../../../environments/environment.prod";

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.page.html',
  styleUrls: ['./edit-info.page.scss'],
})
export class EditInfoPage implements OnInit {

  idEstablishment;
  serviceResp;
  name;
  phone;
  data = {
    idEstablishment: '',
    name: '',
    phone: ''
  };
  constructor(private alertController: AlertController,
              private http: HTTP,
              private loadingController: LoadingController,
              private modalController: ModalController,
              private storage: Storage) { }

  ngOnInit() {
    this.getSavedID();
  }

  /***
   * Update Establishment
   */
  updateEstablishmnet() {
    this.presentLoading();
    const service = 'establishments/updateEstablishment';

    const data = {
      idEstablishment: this.idEstablishment,
      name: this.name,
      phone: this.phone
    };

    console.log('UPDATE DATA: ', data);
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data:data}, {}).then(resp => {
      this.loadingController.dismiss();
      this.serviceResp = JSON.parse(resp.data);
      console.log('UPDATE: ', this.serviceResp);
      if(this.serviceResp.status != 1) {
        this.presentErrorAlert();
        return;
      }
      this.presentSuccessAlert();
    })
    // console.log('New Data: ', dataToString);
    // this.siteService.updateEstablishmnet(JSON.stringify(dataToString)).subscribe( resp => {
    //   this.serviceResponse = resp;
    //   if (this.serviceResponse.status != 1) {
    //     this.presentErrorAlert();
    //     return;
    //   }
    //   this.presentSuccessAlert();
    //
    // });

    // updateEstablishmnet(data) {
    //   const service = 'updateEstablishment';
    //   const options = {
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json',
    //     }
    //   };
    //
    //   return this.http.post(urlBack + service, data, options);
    // }
  }

  /***
   * Get Establishmnet
   */
  getEstablishment() {
    this.presentLoading();
    const service = 'establishments/getEstablishmentInfo';
    const data = {
      idEstablishment: this.idEstablishment
    };

    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data:data}, {}).then(resp => {
      this.loadingController.dismiss();
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      this.fillEstablishment(this.serviceResp.data);
    }).catch(error => {
      console.log('ERROR: ', error);
    });
  }

  /***
   * Fill Establishment
   */
  fillEstablishment(establishment) {
    this.name = establishment.name;
    this.phone = establishment.phone;
  }

  /***
   * Get Saved ID
   */
   async getSavedID() {
    await this.storage.get('siteID').then(value => {
      this.idEstablishment = value;

      console.log('ID:', this.idEstablishment);
      this.getEstablishment();
    })
  }

  /***
   * Present Loading
   */
  async presentLoading() {
    const loader = await this.loadingController.create({
      message: 'Espera por favor...'
    });
    return  await loader.present();
  }

  /***
   * Present Error Alert
   */
  async presentErrorAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Hubo un error',
      message: 'Verifica tu conexión a internet e intenta de nuevo',
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.cerrarModal();
        }
      }]
    });
    await alert.present();
  }

  /***
   * Present Success Alert
   */
  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Listo!',
      message: 'Información Modificada con Exito.',
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.cerrarModal();
        }
      }]
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
