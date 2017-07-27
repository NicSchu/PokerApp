import {Component} from "@angular/core";
import {ProfileService} from "../profile/profile.service";
import {Profile} from "../profile/profile.model";
import {AuthService} from "../login/AuthService";
import {ModalController, NavController} from "ionic-angular";
import {FriendsAddPageComponent} from "./friends-add-page.component";
import {LocalStorageService} from "../common/local-storage.service";
import {FriendsService} from "./friends.service";
import {SubscriptionService} from "../tabs/subscription.service";
import {ProfilePageComponent} from "../profile/profile-page.component";
import {AchievementService} from "../achievements/achievement.service";
import {Achievement} from "../achievements/achievement.model";
import {ClientOptionsConstants} from "../settings/clientOptions-page.constants";
import {AchievementCategory} from "../achievements/achievement-category.constants";

/**
 * Created by sebb9 on 08.06.2017.
 */


@Component({
  selector: 'friends-page',
  templateUrl : 'friends-page.component.html'
})
export class FriendsPageComponent {

  profile : Profile;

  public typeOfList : string = "all";

  private allProfiles: Profile[];
  private friendProfiles: Profile[] = [];

  private achievements : Achievement[] = [];
  private friendBasedAchievements : Achievement[] = [];

  private friendBasedAchievementsMap = {};

  constructor(private profileService : ProfileService,
              private navCtrl: NavController,
              private authService: AuthService,
              private modalCtrl: ModalController,
              private subscriptionService: SubscriptionService,
              private friendsService: FriendsService,
              private achievementService : AchievementService,
              private localStorageService: LocalStorageService) { //localStorageService is used in the HTML file (<ion-navbar> tag)
  }

  ionViewDidLoad() {
    this.subscriptionService.addSubscription(
      this.achievementService.findAll().subscribe(
        (achievemenets: Achievement[]) => {
          if(achievemenets){
            this.achievements = achievemenets;

            //filter only friendbased
            this.friendBasedAchievements = achievemenets.filter((achievemenet : Achievement) => achievemenet.category === AchievementCategory.FRIEND_BASED);

            //create a Map with amount of friends needed for that Achievement
            this.friendBasedAchievements.forEach( (achievemenet : Achievement) => {

              //hier wird davon ausgegangen, dass der String die Zahl der benötigten Freunde enthält...
              let re = /\d+/g;

              let numberToParse = achievemenet.description.match(re).toString();

              let number = parseInt(numberToParse);
              this.friendBasedAchievementsMap[number] = achievemenet;

            });
          }
        }
      )
    );
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

                //check if current count of friends match any achievement
                let accNewAchievement : Achievement = this.friendBasedAchievementsMap[this.profile.friends.length];

                if (accNewAchievement) {

                  //check if user already acc that achievement
                  let alreadyAcc : boolean = false;

                  for (let i = 0; i < this.profile.accAchievements.length; i++) {
                    if (this.profile.accAchievements[i] === accNewAchievement.id) {
                      alreadyAcc = true;
                    }
                  }

                  //if not, add it to the user
                  if (!alreadyAcc) {
                    this.profile.accAchievements.push(accNewAchievement.id);
                    //now update the profile
                    this.profileService.update(this.profile);
                  }
                }

                //finally unsubscribe the "friends"
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

  public showFriendProfilePage(friendProfile: Profile): void {
    this.navCtrl.push(ProfilePageComponent, {profile: friendProfile});
  }

  public sortByName(friends: Profile[]) {
    friends.sort(
      (f1, f2) => {
        let f1Name = f1.name.toLowerCase();
        let f2Name = f2.name.toLowerCase();
        if (f1Name < f2Name) {
          return -1;
        }
        if (f1Name > f2Name) {
          return 1;
        }
        return 0;
      }
    );
    return friends;
  }

  public sortByChips(friends: Profile[]) {
    friends.sort(
      (f1, f2) => {
        if (f1.cash < f2.cash) {
          return 1;
        }
        if (f1.cash > f2.cash) {
          return -1;
        }
        return 0;
      }
    );
    return friends;
  }

  public sortByAchievements(friends: Profile[]) {

    friends.sort(
      (f1, f2) => {
        let f1Points = this.getAchievementPointsOfFriend(f1);
        let f2Points = this.getAchievementPointsOfFriend(f2);
        if(f1Points < f2Points) {
          return 1;
        }
        if(f1Points > f2Points) {
          return -1;
        }
        return 0;
      }
    );
    return friends;
  }

  public getAchievementPointsOfFriend(friend: Profile) {
    let points = 0;
    this.achievements.forEach((achievement : Achievement) => {
      friend.accAchievements.forEach((achievementId : string) => {
        if(achievement.id === achievementId){
          points += achievement.points
        }
      })
    });
    return points;
  }

  public deleteFriend(friend: Profile): void {
    let index = this.profile.friends.indexOf(friend.email);

    this.profile.friends.splice(index, 1);

    this.profileService.update(this.profile);
  }

  //return text color that matches to the background color (black to a yellow background)
  public getCorrespondingTextColor(): string {
    return ClientOptionsConstants.colorNameToTextColor[this.localStorageService.getClientColor()];
  }

}
