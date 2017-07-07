import {Component} from "@angular/core";
import {ProfileService} from "../profile/profile.service";
import {Profile} from "../profile/profile.model";
import {AuthService} from "../login/AuthService";
import {Observable} from "rxjs";
import {NavController, NavParams} from "ionic-angular";
import {FriendsAddPageComponent} from "./friends-add-page.component";
import {LocalStorageService} from "../common/local-storage.service";
/**
 * Created by sebb9 on 08.06.2017.
 */


@Component({
  selector: 'friends-page',
  templateUrl : 'friends-page.component.html'
})
export class FriendsPageComponent {

  profile : Profile;
  friendProfiles : Observable<Profile>[] = [];
  filteredFriendProfiles : Profile[] = [];

  constructor(private profileService : ProfileService,
              private authService : AuthService,
              private navCtrl: NavController,
              private navParams: NavParams,
              private localStorageService: LocalStorageService) { //localStorageService is used in the HTML file (<ion-navbar> tag)

    if (this.navParams.data) {
      //Profile passed by tabs-Page
      this.profile = this.navParams.data;
    }
  }

  ionViewDidLoad() {


  }

  public showAddFriend() : void {
    this.navCtrl.push(FriendsAddPageComponent, this.profile);
  }

  public showFriendLeaderboard() : void {
    //TODO - implement
  }
}
