import { Component, OnInit } from '@angular/core';
import {Storage} from "@ionic/storage";
import {HTTP} from "@ionic-native/http/ngx";
import {environment} from "../../../../environments/environment.prod";

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
  profileServer = urlBack + '/images/establishment/profile/';
  bannerServer = urlBack + '/images/establishment/banner/';
  galleryServer = urlBack + '/images/establishment/gallery/';

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

  constructor(private http: HTTP,
              private storage: Storage) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.getSavedID();
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
    console.log('Gallery array:', this.site.gallery);
    if (data.conf.gallery.length > 0) {
      this.emptyGallery = false;
      for (const v in data.conf.gallery) {
        this.site.gallery.push(this.galleryServer + data.conf.gallery[v] + '.jpg')
      }
      // this.gallery = data.conf.gallery;
    }

  }

}
