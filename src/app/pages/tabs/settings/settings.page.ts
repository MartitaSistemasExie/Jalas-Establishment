import {Component, OnInit} from '@angular/core';
import {Storage} from "@ionic/storage";
import {environment} from "../../../../environments/environment.prod";
import {HTTP} from "@ionic-native/http/ngx";
import {ModalController} from "@ionic/angular";
import {EditInfoPage} from "../../modals/edit-info/edit-info.page";
import {EditPasswordPage} from "../../modals/edit-password/edit-password.page";
import {EditProfilePage} from "../../modals/edit-profile/edit-profile.page";
import {Router} from "@angular/router";

const urlBack = environment.urlBackend;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  idEstablishment;
  serviceResp;
  site = {
    bgImage: '',
    avatarImage: '',
    name: '',
    location: ''
  };
  constructor(private http: HTTP,
              private modalController: ModalController,
              private router: Router,
              private storage: Storage) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getEstablishmentStorage();
  }

  /***
   * Get Establishment Storage
   */
  async getEstablishmentStorage() {
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
    this.site.name = data.name;
    this.site.location = data.conf.location.address;
    if(data.conf.images.profileImage) {
      this.site.avatarImage = environment.establishmentImg + 'profile/' + data.conf.images.profileImage + '.jpg';
    }
    if(data.conf.images.bannerImage) {
      this.site.bgImage = environment.establishmentImg + 'banner/' + data.conf.images.bannerImage + '.jpg';
    }

  }


  /***
   * Open Edit Info
   */
  async openEditInfo() {
    const modal = await  this.modalController.create({
      component: EditInfoPage
    });
    modal.onDidDismiss().then(() => {
      this.getSiteProfile();
    });

    return await modal.present();
  }

  /***
   * Open Edit Profile
   */
  async openEditProfile() {
    const modal = await  this.modalController.create({
      component: EditProfilePage
    });
    modal.onDidDismiss().then(() => {
      this.getSiteProfile();
    });

    return await modal.present();
  }

  /***
   * Open Edit Password
   */
  async openEditPassword() {
    const modal = await  this.modalController.create({
      component: EditPasswordPage
    });
    modal.onDidDismiss().then(() => {
      this.getSiteProfile();
    });

    return await modal.present();
  }

  /***
   * log out
   */
  async logOut() {
    await this.storage.remove('session').then(() => {
      this.storage.remove('siteID').then(() => {
        this.router.navigate(['/login']);
      });
    });
  }

}
