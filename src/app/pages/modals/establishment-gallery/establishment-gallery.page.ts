import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from '../../../../environments/environment';

const urlBack = environment.urlBackend;

@Component({
  selector: 'app-establishment-gallery',
  templateUrl: './establishment-gallery.page.html',
  styleUrls: ['./establishment-gallery.page.scss'],
})
export class EstablishmentGalleryPage implements OnInit {
  public id = this.navParams.get('id');
  establishment;
  serviceResp;
  slideOpts = {
    initialSlide: 0,
    spaceBetween: 0,
    slidesPerView: 1,
    speed: 400
  };
  gallery = [];
  emptyGallery = true;
  galleryServer = environment.establishmentImg + 'gallery/';
  constructor(private modalController: ModalController,
              private navParams: NavParams,
              private http: HTTP) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalController.dismiss();
  }

  /***
   * Get Site Profile
   */
  getSiteProfile() {

    const service = 'establishments/getEstablishmentInfo';
    const data = {
      idEstablishment: this.id
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

  fillSiteProfile(data) {
    this.gallery = [];
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
