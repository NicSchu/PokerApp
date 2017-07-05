import {Component} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";
import {AuthService} from "./AuthService";
import {TabsPage} from "../tabs/tabs";
import {RegistryPageComponent} from "./registry-page.component";
import {SubscriptionService} from "../tabs/subscription.service";
import {ProfileService} from "../profile/profile.service";
import {Profile} from "../profile/profile.model";
import {LocalStorageService} from "../common/local-storage.service";

@Component({
  selector:'login-page',
  templateUrl: 'login-page.component.html'
})
export class LoginPageComponent {

  private email : string;
  private password : string;

  constructor(private alertCtrl: AlertController,
              private navCtrl: NavController,
              private authService: AuthService,
              private subScriptionService:SubscriptionService,
              private profileService : ProfileService,
              private localStorageService : LocalStorageService){

  }

  ionViewDidLoad() {
    //Subscribe User for Login-Logout Events
    let userSubscription = this.authService.getAuthStateObservable().subscribe(
        (user) => {
          //just watch if User is logged in for auto-login
          //if User is defined, go to TabsPage and unsubscribe here. We create new Subscription in Tabs-Page
          if (user) {
            //user is logged in, so we could get his profile
            this.subScriptionService.addSubscription(
              this.profileService.getCurrentProfile().subscribe(
                (profile : Profile) => {
                  if (profile) {
                    this.localStorageService.initializeStorageIfNecessary();
                    userSubscription.unsubscribe();
                    //pass profile to TabsPage
                    this.navCtrl.push(TabsPage, profile);
                  }
                }
              )
            );

          }

        }
      );
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

      //just in case you press login-button
      this.subScriptionService.addSubscription(
        this.profileService.getCurrentProfile().subscribe(
          (profile : Profile) => {
            if (profile) {
              //pass profile to TabsPage
              this.navCtrl.push(TabsPage, profile);
            }
          }
        )
      );

    };

    //now call Service with given CB's
    this.authService.signIn(email, password)
      .catch(catchCallback)
      .then(thenCallback);
  }

  public createAccount() {
    this.navCtrl.push(RegistryPageComponent, {email: this.email, password: this.password});
  }

}
