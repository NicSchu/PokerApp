import {Component} from "@angular/core";
import {ProfileService} from "../profile/profile.service";
import {Profile} from "../profile/profile.model";
import {AuthService} from "../login/AuthService";
import {Observable} from "rxjs";
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
              private authService : AuthService) {
    //TODO - npm install -g firebase-tools
  }

  ionViewDidLoad() {
    let profileSubscription = this.profileService.getCurrentProfile().subscribe(
      (profile : Profile) => {
        this.profile = profile;

        //fill friendProfiles & filteredFriendProfiles
        if(this.profile) {
          let index = 0;
          this.profile.friends.forEach((friendUserID : string) => {
            this.friendProfiles[index] = this.profileService.getProfileByUserId(friendUserID);
            let friendSubscription = this.friendProfiles[index].subscribe((friendProfile : Profile) => {
              if(!friendProfile) {
                friendSubscription.unsubscribe();
              } else {
                this.filteredFriendProfiles[index] = friendProfile;
              }
            });
            index += 1;
          });

        }
      }
    );
    let authSubscription = this.authService.getAuthStateObservable().subscribe(
      (user) => {
        //if User is undefined, user logged off
        if (!user) {
          //unsubscribe all Subscriptions!!!
          profileSubscription.unsubscribe();
          authSubscription.unsubscribe();
        }
      }
    );
  }

  public showAddFriend() : void {
    //TODO - evtl modal machen, damit im onDidMiss die Friendlist aktualisiert wird
  }

  public showFriendLeaderboard() : void {
    //TODO - implement
  }
}
