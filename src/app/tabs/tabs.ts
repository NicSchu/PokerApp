import {Component} from "@angular/core";

import {SettingsPageComponent} from "../settings/settings-page.component";
import {ProfilePageComponent} from "../profile/profile-page.component";
import {LobbyListPageComponent} from "../lobby/lobby-list-page.component";
import {FriendsPageComponent} from "../friends/friends-page.component";
import {ProfileService} from "../profile/profile.service";
import {Profile} from "../profile/profile.model";
import {AuthService} from "../login/AuthService";
import {TabsSubscriptionService} from "./tabs.subscription.service";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProfilePageComponent;
  tab2Root = LobbyListPageComponent;
  tab3Root = FriendsPageComponent;
  tab4Root = SettingsPageComponent;

  private profile : Profile;

  constructor(private profileService: ProfileService,
              private authService : AuthService,
              private subScriptionService: TabsSubscriptionService) {

    console.log('ASDasdasd');
    console.log('profilexsdfgdfg');

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

  public setProfile(p :Profile) : void{
    this.profile = p;
  }

  public getProfile() : Profile {
    return this.profile;
  }

}
