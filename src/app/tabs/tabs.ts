import {Component} from "@angular/core";

import {SettingsPageComponent} from "../settings/settings-page.component";
import {ProfilePageComponent} from "../profile/profile-page.component";
import {LobbyPageComponent} from "../lobby/lobby-page.component";
import {FriendsPageComponent} from "../friends/friends-page.component";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProfilePageComponent;
  tab2Root = LobbyPageComponent;
  tab3Root = FriendsPageComponent;
  tab4Root = SettingsPageComponent;

  //TODO - hier wird das Profile denke gebraucht (siehe dazu auch entsprechendes HTML)

  constructor() {

  }
}
