import {Component} from "@angular/core";

import {SettingsPageComponent} from "../settings/settings-page.component";
import {ProfilePageComponent} from "../profile/profile-page.component";
import {LobbyListPageComponent} from "../lobby/lobby-list-page.component";
import {FriendsPageComponent} from "../friends/friends-page.component";
import {Profile} from "../profile/profile.model";
import {NavParams} from "ionic-angular";
import {SubscriptionService} from "./subscription.service";
import {AuthService} from "../login/AuthService";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProfilePageComponent;
  tab2Root = LobbyListPageComponent;
  tab3Root = FriendsPageComponent;
  tab4Root = SettingsPageComponent;

  private profile : Profile;


  constructor(private navParams: NavParams,
              private subScriptionService : SubscriptionService,
              private authService : AuthService) {

    //Profile passed by Login-Page
    if (this.navParams.data) {
      this.profile = this.navParams.data;
    }
  }

  ionViewDidLoad() {
    //Subscribe User for Login-Logout Events
    this.subScriptionService.addSubscription(
      this.authService.getAuthStateObservable().subscribe(
        (user) => {
          //if User is undefined, user logged off
          if (!user) {
            //unsubscribe all Subscriptions!!!
            this.subScriptionService.unsubscribeAll();
          }
        }
      ));
  }

}
