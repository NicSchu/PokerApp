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
              private navParams: NavParams,
              private friendsService: FriendsService,
              private localStorageService: LocalStorageService) { //localStorageService is used in the HTML file (<ion-navbar> tag)

    if (this.navParams.data) {
      //Profile passed by tabs-Page
      this.profile = this.navParams.data;
    }
  }

  ionViewDidLoad() {
    this.subscriptionService.addSubscription(
      this.friendsService.findAll().subscribe(
        (allProfiles: Profile[]) => {
          //Ich hoffe er bekommt hier mit, wenn sich am eigentlichen "User"-Objekt was ändert, evtl notwendig für Freunde von Freunden!!!!
          this.allProfiles = allProfiles;

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

          //set filtered to all....
          //TODO - maybe sort Friends by Name
          this.filteredFriendProfiles = this.friendProfiles;
        }
      )
    );

  }

  public showAddFriend() : void {
    //TODO - ich denke das hier muss mit einem Modal gemacht werden, damit wir im onDidMiss die Friendlist aktualisieren können!
    this.navCtrl.push(FriendsAddPageComponent, this.profile);
  }

  public showFriendLeaderboard() : void {
    //TODO - implement
  }

  public showFriendProfilePage(profile: Profile): void {
    //TODO - implement!!!!
  }
}
