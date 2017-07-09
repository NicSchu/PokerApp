import {Profile} from "../profile/profile.model";
import {Observable} from "rxjs/Observable";
import {ProfileService} from "../profile/profile.service";
import {SubscriptionService} from "../tabs/subscription.service";
import {Player} from "./player.model";
import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
/**
 * Created by Silas on 08.07.2017.
 */

@Injectable()
export class PlayerService {
  public profileObservable: Observable<Profile>;
  public profile: Profile;

  constructor(private profileService: ProfileService,
              private subscriptionService: SubscriptionService,
              private afDb: AngularFireDatabase) {

    this.profileObservable = this.profileService.getCurrentProfile();

    // TODO Wie Kann man das Profile direkt initialisieren lassen? Denn das passiert offenbar nicht.

    // schmeiß den ganzen mist in lobby-ingame-page.component
    this.subscriptionService.addSubscription(
      this.profileService.getCurrentProfile().subscribe(
        (profile: Profile) => {
          this.profile = profile;
          console.log(this.profile);
        }
      )
    );
  }

  createNewPlayer(): Player{
    console.log(this.profile);
    return new Player(this.profile.name, this.profile.cash, this.profile.email);
  }
}
