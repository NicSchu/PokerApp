import {Component} from "@angular/core";
import {ProfileService} from "../profile/profile.service";
import {Profile} from "../profile/profile.model";
import {AuthService} from "../login/AuthService";
import {Observable} from "rxjs";
import {NavController, NavParams} from "ionic-angular";
import {FriendsAddPageComponent} from "./friends-add-page.component";
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
              private navParams: NavParams) {

    if (this.navParams.data) {
      //Profile passed by tabs-Page
      this.profile = this.navParams.data;
    }
  }

  // ionViewDidLoad() {
    // let profileSubscription = this.profileService.getCurrentProfile().subscribe(
    //   (profile : Profile) => {
    //     this.profile = profile;
    //
    //     //fill friendProfiles & filteredFriendProfiles
    //     if(this.profile) {
    //       let index = 0;
    //       this.profile.friends.forEach((friendUserID : string) => {
    //         this.friendProfiles[index] = this.profileService.getProfileByUserId(friendUserID);
    //         let friendSubscription = this.friendProfiles[index].subscribe((friendProfile : Profile) => {
    //           if(!friendProfile) {
    //             friendSubscription.unsubscribe();
    //           } else {
    //             this.filteredFriendProfiles[index] = friendProfile;
    //           }
    //         });
    //         index += 1;
    //       });
    //
    //     }
    //   }
    // );
    // let authSubscription = this.authService.getAuthStateObservable().subscribe(
    //   (user) => {
    //     //if User is undefined, user logged off
    //     if (!user) {
    //       //unsubscribe all Subscriptions!!!
    //       profileSubscription.unsubscribe();
    //       authSubscription.unsubscribe();
    //     }
    //   }
    // );
  // }

  public showAddFriend() : void {
    this.navCtrl.push(FriendsAddPageComponent);
  }

  public showFriendLeaderboard() : void {
    //TODO - implement
  }
}
