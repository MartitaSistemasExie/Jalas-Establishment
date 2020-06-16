import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, ModalController} from "@ionic/angular";
import {CameraOptions, Camera} from '@ionic-native/camera/ngx';
import {Storage} from "@ionic/storage";
import {HTTP} from "@ionic-native/http/ngx";
import {environment} from "../../../../environments/environment.prod";

const urlBack = environment.urlBackend;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  avatarImg;
  bannerImg;
  gallery = [];
  emptyGallery = true;
  selectedBanner;
  selectedAvatar;
  selectedGallery;
  idEstablishment;
  serviceResp;
  profileServer = urlBack + '/images/establishment/profile/';
  bannerServer = urlBack + '/images/establishment/banner/';
  galleryServer = urlBack + '/images/establishment/gallery/';

  constructor(private alertController: AlertController,
              private camera: Camera,
              private http: HTTP,
              private loadingController: LoadingController,
              private modalController: ModalController,
              private storage: Storage) {
  }

  ngOnInit() {
    this.getSavedID();
  }

  /***
   * Get Saved ID
   */
  async getSavedID() {
    await this.storage.get('siteID').then((value => {
      this.idEstablishment = value;
      console.log('ID: ', this.idEstablishment);
      this.getSiteProfile();
    }));
  }

  /***
   * Get Site Profile
   */
  getSiteProfile() {

    this.presentLoading();
    const service = 'establishments/getEstablishmentInfo';
    const data = {
      idEstablishment: this.idEstablishment
    };

    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data: data}, {}).then(resp => {
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      this.fillImages(this.serviceResp.data);
    }).catch(error => {
      console.log('ERROR: ', error);
    });

  }

  /***
   * Fill Images
   */
  fillImages(data) {
    this.loadingController.dismiss();
    if (data.conf.images.profileImage) {
      this.avatarImg = this.profileServer + data.conf.images.profileImage + '.jpg';
    }

    if (data.conf.images.bannerImage) {
      this.bannerImg = this.bannerServer + data.conf.images.bannerImage + '.jpg';
    }

    this.gallery = [];
    console.log('Gallery array:', this.gallery);
    if (data.conf.gallery.length > 0) {
      this.emptyGallery = false;
      for (const v in data.conf.gallery) {
        this.gallery.push(this.galleryServer + data.conf.gallery[v] + '.jpg')
      }
      // this.gallery = data.conf.gallery;
    }
  }

  /***
   * Add Banner Image
   */
  addBannerImage() {
    const options: CameraOptions = {
      quality: 15,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    console.log('CAMERA OPTS: ', options);
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log('Image DATA', imageData);
      this.selectedBanner = 'data:image/jpeg;base64,' + imageData;
      console.log('SELECTED BANNER', this.selectedBanner);
      this.callUpdateBanner();
    }, (err) => {
      // Handle error
    });

  }

  /***
   * Call Update Banner
   */
  callUpdateBanner() {
    this.presentLoading();
    const service = 'establishments/setBannerImage';
    const data = {
      idEstablishment: this.idEstablishment,
      image: this.selectedBanner
    };
    console.log('DATA UPDATE BANNER:', data);
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data: data}, {}).then(resp => {
      this.loadingController.dismiss();
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      if (this.serviceResp.status != 1) {
        this.presentErrorAlert();
        return;
      }
      this.presentSuccessAlert();
    }).catch(error => {
      console.log('ERROR: ', error);
      if(error.status == 413) {
        this.presentErrorImage();
      }
    });
  }


  /***
   * Add Avatar Image
   */
  addAvatarImage() {
    const options: CameraOptions = {
      quality: 15,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    console.log('CAMERA OPTS: ', options);
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log('Image DATA', imageData);
      this.selectedAvatar = 'data:image/jpeg;base64,' + imageData;
      console.log('SELECTED BANNER', this.selectedAvatar);
      this.callUpdateAvatar();
    }, (err) => {
      // Handle error
    });
  }

  /***
   * Call Update Avatar
   */
  callUpdateAvatar() {
    this.presentLoading();
    const service = 'establishments/setProfileImage';
    const data = {
      idEstablishment: this.idEstablishment,
      image: this.selectedAvatar
    };
    console.log('DATA UPDATE BANNER:', data);
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data: data}, {}).then(resp => {
      this.loadingController.dismiss();
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      if (this.serviceResp.status != 1) {
        this.presentErrorAlert();
        return;
      }
      this.presentSuccessAlert();
    }).catch(error => {
      console.log('ERROR: ', error);
      if(error.status == 413) {
        this.presentErrorImage();
      }
    });
  }


  /***
   * Add Gallery Image
   */
  addGalleryImage() {
    const options: CameraOptions = {
      quality: 15,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    console.log('CAMERA OPTS: ', options);
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log('Image DATA', imageData);
      this.selectedGallery = 'data:image/jpeg;base64,' + imageData;
      console.log('SELECTED BANNER', this.selectedAvatar);
      this.callAddGallery();
    }, (err) => {
      // Handle error
    });
  }

  /***
   * Call Add Gallery
   */
  callAddGallery() {
    this.presentLoading();
    const service = 'establishments/addImage';
    const data = {
      idEstablishment: this.idEstablishment,
      image: this.selectedGallery
    };
    console.log('DATA UPDATE BANNER:', data);
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data: data}, {}).then(resp => {
      this.loadingController.dismiss();
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      if (this.serviceResp.status != 1) {
        this.presentErrorAlert();
        return;
      }
      this.presentSuccessAlert();
    }).catch(error => {
      console.log('ERROR: ', error);
      if(error.status == 413) {
        this.presentErrorImage();
      }
    });
  }

  /***
   * removeGalleryImage
   */
  removeGalleryImage(image) {
    console.log('imageToRemove', image.split(this.galleryServer)[1].split('.jpg')[0]);
    const service = 'establishments/removeImage';
    const data = {
      idEstablishment: this.idEstablishment,
      image: image.split(this.galleryServer)[1].split('.jpg')[0]
    };
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data: data}, {}).then(resp => {
      this.loadingController.dismiss();
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      if (this.serviceResp.status != 1) {
        this.presentErrorAlert();
        return;
      }
      this.presentSuccessAlert();
    }).catch(error => {
      console.log('ERROR: ', error);
    });
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
   * Present Error Alert
   */
  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error!',
      message: 'Verifica tu internet e intenta más tarde',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.cerrarModal();
          }
        }
      ]
    });
    await alert.present();
  }

  /***
   * Present Error Image
   */
  async presentErrorImage() {
    const alert = await this.alertController.create({
      header: 'Lo Sentimos...',
      message: 'Tu imagen es demasiado grande, intenta con una con menos resolución',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.cerrarModal();
          }
        }
      ]
    });
    await alert.present();
  }

  /***
   * Present Success Alert
   */
  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Listo!',
      message: 'Agregado correctamente',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.cerrarModal();
          }
        }
      ]
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
