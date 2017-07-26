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
  private maxCharsOfDisplayname : number = 15;

  constructor(private alertCtrl : AlertController,
              private authService : AuthService,
              private navParams : NavParams,
              private profileService : ProfileService,
              private navCtrl : NavController, //used by loginCallback()
              ) {

    if (this.navParams.data) {
      this.email = this.navParams.data.email;
      this.password = this.navParams.data.password;
    }

  }

  //TODO eventuell noch sowas einfügen : https://ionicframework.com/docs/api/components/slides/Slides/
  public createAccount(){

    let inputErrors : string[] = [];

    if (!this.displayname || this.displayname.length <= 0) {
      inputErrors.push('Please insert a Displayname! <br/>');
    } else {
      if (this.displayname.length > this.maxCharsOfDisplayname) {
        inputErrors.push('Your Displayname is to long. (Max ' + this.maxCharsOfDisplayname + ' characters) <br/>');
      }
    }

    if (!this.email || this.email.length <= 0) {
      inputErrors.push('Please insert a E-Mail! <br/>');
    } else {
      if (!this.validateEmail(this.email)) {
        inputErrors.push('Please insert a valid E-Mail! <br/>');
      }
    }

    if (!this.password || this.password.length <= 0) {
      inputErrors.push('Please insert a Password! <br/>');
    }

    if (!this.passwordConfirmation || this.passwordConfirmation.length <= 0) {
      inputErrors.push('You have to confirm your Password! <br/>');
    }

    if (this.password && this.passwordConfirmation && this.password.length > 0 && this.passwordConfirmation.length > 0) {
      if (this.password !== this.passwordConfirmation) {
        inputErrors.push('Your password inputs are not equal! <br/>')
      }
    }

    //inputErros occured
    if (inputErrors.length > 0) {

      let alertMessage : string = inputErrors.reduce( (a,b) => a + b );

      let alert = this.alertCtrl.create({
        title: 'Input Errors occured',
        message: alertMessage,
        buttons: ['Dismiss']
      });

      alert.present();

    } else {
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

          this.profileService.createProfile(new Profile(this.displayname, this.email));

        };

        //now call Service with given CB's
        this.authService.createAccount(this.email, this.password)
          .catch(catchCallBack)
          .then(thenCallback);
      }
    }

  }

  //TODO - evtl. muss das in die Softwaredoku - Funktion aus https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
  //übernommen
  private validateEmail(email : string): boolean {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
