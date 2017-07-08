import {Component} from "@angular/core";
import {ProfileService} from "../profile/profile.service";
import {Profile} from "../profile/profile.model";
import {AuthService} from "../login/AuthService";
import {Observable} from "rxjs";
import {ModalController, NavController, NavParams} from "ionic-angular";
import {FriendsAddPageComponent} from "./friends-add-page.component";
import {LocalStorageService} from "../common/local-storage.service";
import {FriendsService} from "./friends.service";
import {SubscriptionService} from "../tabs/subscription.service";
import {ProfilePageComponent} from "../profile/profile-page.component";
/**
 * Created by sebb9 on 08.06.2017.
 */


@Component({
  selector: 'friends-page',
  templateUrl : 'friends-page.component.html'
})
export class FriendsPageComponent {

  profile : Profile;

  private allProfiles: Profile[];
  private friendProfiles: Profile[] = [];
  private filteredFriendProfiles: Profile[] = [];

  constructor(private profileService : ProfileService,
              private navCtrl: NavController,
              private authService: AuthService,
              private modalCtrl: ModalController,
              private subscriptionService: SubscriptionService,
              private friendsService: FriendsService,
              private localStorageService: LocalStorageService) { //localStorageService is used in the HTML file (<ion-navbar> tag)
  }

  ionViewDidLoad() {
    this.subscriptionService.addSubscription(
      this.profileService.getCurrentProfile().subscribe(
        (profile: Profile) => {
          if (profile) {
            this.profile = profile;

            //now get friends
            let friendsSubscription = this.friendsService.findAll().subscribe(
              (allProfiles: Profile[]) => {
                //Ich hoffe er bekommt hier mit, wenn sich am eigentlichen "User"-Objekt was ändert, evtl notwendig für Freunde von Freunden!!!!
                this.allProfiles = allProfiles;

                //reset friends, because maybe user changed something
                this.friendProfiles = [];

                //now filter friends of User
                for (let i = 0; i < this.profile.friends.length; i++) {
                  for (let j = 0; j < this.allProfiles.length; j++) {
                    let foundFriendProfile: Profile;
                    if (this.profile.friends[i] === this.allProfiles[j].email) {
                      foundFriendProfile = this.allProfiles[j];
                      this.friendProfiles.push(foundFriendProfile);
                    }
                  }
                }
                //sort and set filtered to all....
                this.sortByName(this.friendProfiles);
                this.filteredFriendProfiles = this.friendProfiles;

                friendsSubscription.unsubscribe();
              }
            );
          }
        }
      )
    );
  }

  public showAddFriend() : void {
    this.navCtrl.push(FriendsAddPageComponent, this.profile);
  }

  public showFriendLeaderboard() : void {
    //TODO - implement
  }

  public showFriendProfilePage(friendProfile: Profile): void {
    this.navCtrl.push(ProfilePageComponent, {profile: friendProfile});
  }

  private sortByName(friends: Profile[]) {
    friends.sort(
      (f1, f2) => {
        if (f1.name < f2.name) {
          return -1;
        }
        if (f1.name > f2.name) {
          return 1;
        }
        return 0;
      }
    );
  }

  public deleteFriend(friend: Profile): void {
    let index = this.profile.friends.indexOf(friend.email);

    this.profile.friends.splice(index, 1);

    this.profileService.update(this.profile);
  }


}
