import {Component} from "@angular/core";
import {AlertController, NavParams, ViewController} from "ionic-angular";
import {AuthService} from "./AuthService";

@Component({
  selector:'registry-page',
  templateUrl: 'registry-page.component.html'
})

export class RegistryPageComponent {
  private email : string;
  private password : string;
  private passwordConfirmation : string;

  constructor(private alertCtrl : AlertController,
              private authService : AuthService,
              private viewCtrl : ViewController,
              private navParams : NavParams){
    this.email = this.navParams.data[0];
    this.password = this.navParams.data[1];
  }

  public createAccount(){
    if(this.password === this.passwordConfirmation){
      this.authService.createAccount(this.email, this.password)
        .catch(
          (error: any) => {

            if (error) {

              let code = error.code;
              let altertMessage = "";
              if (code === "auth/email-already-in-use") {
                altertMessage = 'E-Mail already in Use';
              }

              if (code === "auth/invalid-email") {
                altertMessage = 'Not a valid E-Mail'; //TODO - evtl Hinweis auf G-Mail
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
          }
        );
      this.viewCtrl.dismiss(this.email);
    } else {
      let alert = this.alertCtrl.create({
        title: 'Failure',
        message: '\"Password\" and \"Confirm-Password\" do not match',
        buttons: ['Dismiss']
      });
      alert.present();
    }
  }
}
