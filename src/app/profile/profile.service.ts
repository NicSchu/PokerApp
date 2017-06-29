import {Injectable} from "@angular/core";
import {AuthService} from "../login/AuthService";
import {AngularFireDatabase, FirebaseObjectObservable} from "angularfire2/database";
import {Profile} from "./profile.model";

import "rxjs/add/operator/map";
import {Observable} from "rxjs/Observable";
/**
 * Created by sebb9 on 28.06.2017.
 */

@Injectable()
export class ProfileService {

  fbProfile : FirebaseObjectObservable<any>;
  profile : Observable<Profile>;


  constructor(private authService : AuthService,
              private afDb : AngularFireDatabase) {

    this.fbProfile = afDb.object('user/' + authService.getCurrentUser().uid + '/profile');
    console.log(this.fbProfile);

    this.profile = this.fbProfile.map(
      (fbProfile: any) : Profile => {
        let profile = Profile.createWith(fbProfile);
        profile.firebaseUserId = fbProfile.$key;
        return profile;
      }
    )


  }

  public createProfile(profile: Profile) : void {
    this.fbProfile.set(this.copyAndPrepareProfile(profile));
  }

  public update(profile : Profile) : void {
    this.fbProfile.update(this.copyAndPrepareProfile(profile));
  }

  public getCurrentProfile() : Observable<Profile> {
    return this.profile;
  }

  private copyAndPrepareProfile(profile: any): Profile {
    let newProfile = Profile.createWith(profile);
    newProfile.firebaseUserId = newProfile.firebaseUserId || null;
    newProfile.name = newProfile.name || null;
    newProfile.cash = newProfile.cash || null;
    newProfile.friends = newProfile.friends || null;
    newProfile.achievements = newProfile.achievements || null;
    newProfile.roundsPlayed = newProfile.roundsPlayed || null;
    return newProfile;
  }

}
