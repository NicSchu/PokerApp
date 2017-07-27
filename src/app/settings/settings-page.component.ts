import {Component} from "@angular/core";
import {AuthService} from "../login/AuthService";
import {AlertController, App, NavController} from "ionic-angular";
import {ImpressumPageComponent} from "./impressum-page.component";
import {ClientOptionsPageComponent} from "./clientOptions-page.component";
import {LocalStorageService} from "../common/local-storage.service";

/**
 * Created by sebb9 on 08.06.2017.
 */


@Component({
  selector: 'settings-page',
  templateUrl: 'settings-page.component.html'
})
export class SettingsPageComponent {


  constructor(private authService : AuthService,
              private navCtrl : NavController,
              private alertCtrl : AlertController,
              private appCtrl: App,
              public localStorageService : LocalStorageService) { //localStorageService is used in the HTML file (<ion-navbar> tag)
  }

  public showImpressum() {
    this.navCtrl.push(ImpressumPageComponent)
  }

  public showClientOptions() {
    this.navCtrl.push(ClientOptionsPageComponent)
  }

  public logout(){


    this.authService.logout()
      .then((a) => {
        //dismiss actual View
        this.appCtrl.getRootNav().popToRoot();

        let alert = this.alertCtrl.create({
          title: '',
          message: 'You logged out',
          buttons: ['Dismiss']
        });

        alert.present();



      })
      .catch((error) => {
        console.log(error);
        console.log('error');
      });
  }

}
