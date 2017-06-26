import {Component} from "@angular/core";
import {AlertController, NavController, NavParams} from "ionic-angular";
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
              private navCtrl : NavController,
              private navParams : NavParams) {


    if (this.navParams.data) {
      this.email = this.navParams.data.email;
      this.password = this.navParams.data.password;
    }

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
          }
        )
        .then((user) => {
          //TODO - wir müssen generell noch das Profile des Benutzers anlegen, welcher sich gerade angemeldet hat ()
          //ggf können wir aus unserem Datenmodell den Login streichen und stattdessen die Ionic-ID mit unserem Profile verknüpfen
          //(Sebi und Sebi haben da schon mit Herr Süß gesprochen, wie die Struktur in Firebase sein könnte.)

          //TODO - hier muss das Profile-Model an die Tab-Page gepusht werden!
        });

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
