import {Component} from "@angular/core";

import {SettingsPageComponent} from "../settings/settings-page.component";
import {ProfilePageComponent} from "../profile/profile-page.component";
import {LobbyPageComponent} from "../lobby/lobby-page.component";
import {FriendsPageComponent} from "../friends/friends-page.component";
import {ProfileService} from "../profile/profile.service";
import {Profile} from "../profile/profile.model";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProfilePageComponent;
  tab2Root = LobbyPageComponent;
  tab3Root = FriendsPageComponent;
  tab4Root = SettingsPageComponent;

  private profile:Profile;

  //TODO - hier wird das Profile denke gebraucht (siehe dazu auch entsprechendes HTML)

  constructor(private profileService: ProfileService) {

  }

  ionViewDidLoad() {
    this.profileService.getCurrentProfile().subscribe(
      (profile : Profile) => {

        //otherwise the User is not logged in, because we create an profile with the first account creation
        this.profile = profile;
      }
    );
  }
}
