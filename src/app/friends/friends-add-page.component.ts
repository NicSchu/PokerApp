import {Component} from "@angular/core";
import {FriendsService} from "./friends.service";
import {Profile} from "../profile/profile.model";
import {AlertController, NavParams, ViewController} from "ionic-angular";
import {SubscriptionService} from "../tabs/subscription.service";
import {ProfileService} from "../profile/profile.service";
/**
 * Created by sebb9 on 05.07.2017.
 */
@Component({
  selector: 'friends-add-page',
  templateUrl: 'friends-add-page.component.html'
})
export class FriendsAddPageComponent {

  private email: string = '';
  private profile: Profile;
  private allProfiles: Profile[] = [];

  constructor(private friendsService: FriendsService,
              private navParams: NavParams,
              private subscriptionService: SubscriptionService,
              private altertCtrl: AlertController,
              private profileService: ProfileService,
              private viewCtrl: ViewController) {

    //pass Profile by friends-page
    if (this.navParams.data) {
      this.profile = this.navParams.data;
    }

  }

  ionViewDidLoad() {
    this.subscriptionService.addSubscription(
      this.friendsService.findAll().subscribe(
        (profiles: Profile[]) => {
          this.allProfiles = profiles;
        }
      ));
  }

  public addFriendByEMail() {

    if (this.validateEmail(this.email)) {
      let foundProfile: Profile;
      for (let i = 0; i < this.allProfiles.length; i++) {
        let friendProfile: Profile = this.allProfiles[i];
        if (friendProfile.email === this.email) {
          foundProfile = friendProfile;
        }
      }

      //now check foundProfile
      if (foundProfile) {
        //now add that profile to logged-in profile of user
        this.profile.friends = this.profile.friends || [];
        this.profile.friends.push(foundProfile.email);

        //now persist that friend
        this.profileService.update(this.profile);
      } else {

        let alert = this.altertCtrl.create({
          title: 'Your Input seems to be not a valid E-Mail',
          message: 'Please insert a valid E-Mail',
          buttons: ['OK']
        });
        alert.present();
      }
    } else {

      let alert = this.altertCtrl.create({
        title: 'Your Input seems to be not a valid E-Mail',
        message: 'Please insert a valid E-Mail',
        buttons: ['OK']
      });
      alert.present();

    }


  }

  //TODO - evtl. muss das in die Softwaredoku - Funktion aus https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
  //übernommen
  private validateEmail(email): boolean {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }




}
