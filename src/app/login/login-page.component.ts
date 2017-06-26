import {Component} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {ProfilePageComponent} from "../profile/profile-page.component";

@Component({
  selector:'profile-page',
  templateUrl: 'login-page.component.html'
})
export class LoginPageComponent{

  private email : string;
  private password : string;

  constructor(private alertCtrl: AlertController,
              private firebaseAuth : AngularFireAuth,
              private navCtrl: NavController){

  }

  public signIn(){
    this.firebaseAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      .catch(
      (error: any) => {

        if (error) {

          let code = error.code;
          let altertMessage = "";
          if (code === "auth/user-disabled") {
            altertMessage = 'Your account has beend disabled';
          }

          if (code === "auth/invalid-email") {
            altertMessage = 'Not a valid E-Mail';
          }

          if (code === "auth/wrong-password") {
            altertMessage = 'Wrong password';
          }

          if (code === "auth/user-not-found") {
            altertMessage = 'There is no user corresponding to the given E-Mail'
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
      .then( () => {

        //TODO - ein Observer für AuthChange erstellen, der alle Pages löscht mit this.navCtrl.popToRoot()
        console.log(this.firebaseAuth.auth.currentUser);
        this.navCtrl.push(ProfilePageComponent)
      } );
  }

  public createAccount() {

    let test  =
    this.firebaseAuth.auth.createUserWithEmailAndPassword(this.email, this.password).catch(
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

  }
}
