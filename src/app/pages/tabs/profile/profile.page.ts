import { Component, OnInit } from '@angular/core';
import {Storage} from "@ionic/storage";
import {CameraOptions, Camera} from '@ionic-native/camera/ngx';
import {HTTP} from "@ionic-native/http/ngx";
import {environment} from "../../../../environments/environment.prod";
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { EstablishmentGalleryPage } from '../../modals/establishment-gallery/establishment-gallery.page';

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  idEstablishment;
  serviceResp;
  emptyGallery = true;
  // profileServer = urlBack + '/images/establishment/profile/';
  // bannerServer = urlBack + '/images/establishment/banner/';
  // galleryServer = urlBack + '/images/establishment/gallery/';

  profileServer = environment.establishmentImg + 'profile/';
  bannerServer = environment.establishmentImg + 'banner/';
  galleryServer = environment.establishmentImg + 'gallery/';

  site = {
    name: '',
    email: '',
    phone: '',
    location: '',
    hours: {
      lunes: '',
      martes: '',
      miercoles: '',
      jueves: '',
      viernes: '',
      sabado: '',
      domingo: '',
    },
    avatarImage:'',
    bgImage: '',
    gallery: []
  };

  slideOpts = {
    initialSlide: 0,
    spaceBetween: 0,
    slidesPerView: 2.5,
    speed: 400
  };

  selectedGallery;
  gallery = [];

  constructor(private http: HTTP,
              private loadingController: LoadingController,
              private modalController: ModalController,
              private camera: Camera,
              private photoViewer: PhotoViewer,
              private storage: Storage,
              private alertController: AlertController) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.getSavedID();
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
      allowEdit: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    console.log('CAMERA OPTS: ', options);
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log('Image DATA', imageData);
      this.selectedGallery = 'data:image/jpeg;base64,' + imageData;
      this.callAddGallery();
    }, (err) => {
      // Handle error
    });
  }

  async openEstablishmentGallery() {
    console.log('openEstablishmentGallery: ', this.idEstablishment);
    const modal = await this.modalController.create( {
      component: EstablishmentGalleryPage,
      componentProps: {
        id: this.idEstablishment
      }
    });
    return await modal.present();

  }

  openPhoto(image) {
    console.log(image);
    this.photoViewer.show(image);
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
      if (error.status == 413) {
        this.presentErrorImage();
      }
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
      buttons: ['Ok']
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
      buttons: ['Ok']
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
      buttons: ['Ok']
    });
    await alert.present();
  }

  /***
   * getSavedID
   */
  async getSavedID() {
    await this.storage.get('siteID').then((value => {
      this.idEstablishment = value;
      console.log('ID: ', this.idEstablishment);
      this.getSiteProfile();
    }));
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
   * Get Site Profile
   */
  getSiteProfile() {

    const service = 'establishments/getEstablishmentInfo';
    const data = {
      idEstablishment: this.idEstablishment
    };

    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data:data}, {}).then(resp => {
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      this.fillSiteProfile(this.serviceResp.data);
    }).catch(error => {
      console.log('ERROR: ', error);
    });

  }

  /***
   * Fill Site Profile
   */
  fillSiteProfile(data) {


    //site = {

    //     gallery: []
    //   };

    this.site.name = data.name;
    this.site.email = data.email;
    this.site.phone = data.phone;
    this.site.location = data.conf.location.address;
    this.site.hours.lunes = data.conf.hours.lunes;
    this.site.hours.martes = data.conf.hours.martes;
    this.site.hours.miercoles = data.conf.hours.miercoles;
    this.site.hours.jueves = data.conf.hours.jueves;
    this.site.hours.viernes = data.conf.hours.viernes;
    this.site.hours.sabado = data.conf.hours.sabado;
    this.site.hours.domingo = data.conf.hours.domingo;

    if(data.conf.images.profileImage) {
      this.site.avatarImage = this.profileServer + data.conf.images.profileImage + '.jpg';
    }
    if(data.conf.images.bannerImage) {
      this.site.bgImage = this.bannerServer + data.conf.images.bannerImage + '.jpg';
    }

    this.site.gallery = [];
    console.log('Gallery array:', this.gallery);
    if (data.conf.gallery.length > 0) {
      this.emptyGallery = false;
      // tslint:disable-next-line: forin
      for (const v in data.conf.gallery) {
        // this.site.gallery.push(this.galleryServer + data.conf.gallery[v] + '.jpg');
        this.gallery.push(this.galleryServer + data.conf.gallery[v] + '.jpg');
      }
      // this.gallery = data.conf.gallery;
    }

  }

}
