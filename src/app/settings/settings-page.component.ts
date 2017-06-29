import {Component} from "@angular/core";
import {AuthService} from "../login/AuthService";
import {AlertController, NavController} from "ionic-angular";
import {LoginPageComponent} from "../login/login-page.component";
import {ImpressumPageComponent} from "./impressum-page.component";
import {CardbacksPageComponent} from "./cardbacks-page.component";
import {ClientOptionsPageComponent} from "./clientOptions-page.component";
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
              private alertCtrl : AlertController) {
  }

  public showImpressum() {
    this.navCtrl.push(ImpressumPageComponent)
  }

  public showCardbacks() {
    this.navCtrl.push(CardbacksPageComponent)
  }

  public showClientOptions() {
    this.navCtrl.push(ClientOptionsPageComponent)
  }

  public logout(){


    this.authService.logout()
      .then((a) => {
        console.log(a);
        console.log('a');

        //set LoginPage as new Root-Page(because Tabs-Page is the new Root(got new NavController))
        this.navCtrl.setRoot(LoginPageComponent);
        //go back to Login-Page
        this.navCtrl.popToRoot();

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
