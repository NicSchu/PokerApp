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

    //init-Function can't be placed here, because DI would execute it before we are logged in at Registry-Page
  }

  public createProfile(profile: Profile) : void {

    //first init object to watch
    this.initFirebaseObject();

    this.fbProfile.set(this.copyAndPrepareProfile(profile));
  }

  public update(profile : Profile) : void {
    this.fbProfile.update(this.copyAndPrepareProfile(profile));
  }

  public getCurrentProfile() : Observable<Profile> {

    //first init object to watch
    this.initFirebaseObject();

    return this.profile;
  }

  //use this function to get a friend´s profile
  public getProfileByUserId(uid : string) : Observable<Profile> {
    return this.afDb.object('users/' + uid + '/profile').map(
      (fbProfile: any) : Profile => {
        let profile = Profile.createWith(fbProfile);
        return profile;
      }
    );
  }

  private copyAndPrepareProfile(profile: any): Profile {
    let newProfile = Profile.createWith(profile);
    newProfile.name = newProfile.name || null;
    newProfile.cash = newProfile.cash || null;
    return newProfile;
  }


  private initFirebaseObject() {

    //user must be logged in!

    if (!this.fbProfile) {
      this.fbProfile = this.afDb.object('users/' + this.authService.getCurrentUser().uid + '/profile');
      console.log(this.fbProfile);

      this.profile = this.fbProfile.map(
        (fbProfile: any) : Profile => {
          let profile = Profile.createWith(fbProfile);
          return profile;
        }
      )
    }
  }

  public getProfilePicturePath() : string {
    return 'users/' + this.authService.getCurrentUser().uid + '/profilePic/';
  }

}
