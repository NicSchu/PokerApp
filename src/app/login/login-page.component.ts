import {Component} from "@angular/core";
import {AlertController} from "ionic-angular";
import {AngularFireDatabase} from "angularfire2/database";

@Component({
  selector:'profile-page',
  templateUrl: 'login-page.component.html'
})
export class LoginPageComponent{

  private email : String;
  private password : String;

  constructor(public alertCtrl: AlertController){

  }

  signIn(){
    console.log(this.email);
    console.log(this.password);
    if(this.email && this.password) {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .catch(function (err) {
          let alert = this.alertCtrl.create({
            title: 'Eingabefehler',
            message: "Falsche Email/Passwort Kombination :/",
            buttons: ['Schliessen']
          });
          alert.present();
        });
    }
  }

  createAccount(){
    //TODO: hier neue page aufrufen
  }
}
