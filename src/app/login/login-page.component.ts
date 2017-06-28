import {Component} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";
import {AngularFireAuth} from "angularfire2/auth";
import {AuthService} from "./AuthService";
import {TabsPage} from "../tabs/tabs";
import {RegistryPageComponent} from "./registry-page.component";


@Component({
  selector:'profile-page',
  templateUrl: 'login-page.component.html'
})
export class LoginPageComponent{

  private email : string;
  private password : string;

  constructor(private alertCtrl: AlertController,
              private firebaseAuth : AngularFireAuth,
              private navCtrl: NavController,
              private authService: AuthService){

    //TODO - workaround, weil firebaseAuth.auth.currentUser nicht sofort verfügbar ist, bzw erstmal null ist (warum auch immer)

    let recordsJSON: string = localStorage.getItem('records');

  }

  public login(){
    this.authService.signIn(this.email, this.password)
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
      .then( (user) => {

        let observable = this.firebaseAuth.authState.subscribe((data) => {
          if(!data){
            let alert = this.alertCtrl.create({
              title: '',
              message: 'You logged out',
              buttons: ['Dismiss']
            });
            alert.present();
            this.navCtrl.popToRoot();
            observable.unsubscribe();
          }
        });

        //TODO - create Profile for Firebase-User
        this.navCtrl.push(TabsPage)
      } );
  }

  public createAccount() {
    this.navCtrl.push(RegistryPageComponent, {email: this.email, password: this.password});
  }

}
