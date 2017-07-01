import {Component} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";
import {AuthService} from "./AuthService";
import {TabsPage} from "../tabs/tabs";
import {RegistryPageComponent} from "./registry-page.component";


@Component({
  selector:'login-page',
  templateUrl: 'login-page.component.html'
})
export class LoginPageComponent {

  private email : string;
  private password : string;

  constructor(private alertCtrl: AlertController,
              private navCtrl: NavController,
              private authService: AuthService){

    //TODO - workaround, weil firebaseAuth.auth.currentUser nicht sofort verfügbar ist, bzw erstmal null ist (warum auch immer)
    this.email = 'test@test.de';
    this.password = '123456';
  }

  public login(email : string, password : string) {
    let catchCallback = (error : any) => {
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
    };
    let thenCallback = (user : any) => {
      this.navCtrl.push(TabsPage)
    };

    //now call Service with given CB's
    this.authService.signIn(email, password)
      .catch(catchCallback)
      .then(thenCallback);
  }

  public createAccount() {
    this.navCtrl.push(RegistryPageComponent, {email: this.email, password: this.password, loginCallback: this.login});
  }

}
