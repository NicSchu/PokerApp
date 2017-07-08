import {Profile} from "../profile/profile.model";
import {Observable} from "rxjs/Observable";
import {ProfileService} from "../profile/profile.service";
import {SubscriptionService} from "../tabs/subscription.service";
/**
 * Created by Silas on 08.07.2017.
 */


export class PlayerService {

  public profileObservable: Observable<Profile>;
  profile: Profile;
  constructor(private profileService: ProfileService,
              private subscriptionService: SubscriptionService) {
    this.profileObservable = this.profileService.getCurrentProfile();
    this.subscriptionService.addSubscription(
      this.profileObservable.subscribe(
        (profile: Profile) => {
          this.profile = profile;
        }
      )
    );
  }


}
