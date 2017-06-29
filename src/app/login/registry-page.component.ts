import {Component} from "@angular/core";
import {AlertController, NavController, NavParams} from "ionic-angular";
import {AuthService} from "./AuthService";
import {ProfileService} from "../profile/profile.service";
import {Profile} from "../profile/profile.model";

@Component({
  selector:'registry-page',
  templateUrl: 'registry-page.component.html'
})

export class RegistryPageComponent {
  private email : string;
  private displayname : string;
  private password : string;
  private passwordConfirmation : string;

  private loginCallback : (email : string, password:string) => void;

  constructor(private alertCtrl : AlertController,
              private authService : AuthService,
              private navParams : NavParams,
              private profileService : ProfileService,
              private navCtrl : NavController,) { //used by loginCallback()


    if (this.navParams.data) {
      this.email = this.navParams.data.email;
      this.password = this.navParams.data.password;

      if (this.navParams.data.loginCallback) {
        this.loginCallback = this.navParams.data.loginCallback;
      }
    }

  }

  public createAccount(){
    if(this.password === this.passwordConfirmation) {
      let catchCallBack = (error : any) => {
        if (error) {

          let code = error.code;
          let altertMessage = "";
          if (code === "auth/email-already-in-use") {
            altertMessage = 'E-Mail already in Use';
          }

          if (code === "auth/invalid-email") {
            altertMessage = 'Not a valid E-Mail';
          }

          if (code === "auth/operation-not-allowed") {
            altertMessage = 'E-Mail and Password authentication is not enabled';
          }

          if (code === "auth/weak-password") {
            altertMessage = error.message
          }
          let alert = this.alertCtrl.create({
            title: 'Something went wrong',
            message: altertMessage,
            buttons: ['Dismiss']
          });

          alert.present();
        }
      };
      let thenCallback = (user: any) => {

        this.profileService.createProfile(new Profile(this.displayname));

        //this function also push Tabs-Page
        this.loginCallback(this.email, this.password);

      };

      //now call Service with given CB's
      this.authService.createAccount(this.email, this.password)
        .catch(catchCallBack)
        .then(thenCallback);
    }
  }
}
