import {Injectable} from "@angular/core";
import {AuthService} from "../login/AuthService";
import {AngularFireDatabase, FirebaseObjectObservable} from "angularfire2/database";
import {Profile} from "./profile.model";

import {FirebaseApp} from "angularfire2";

import "firebase/storage";
import * as firebase from "firebase/app";
import Storage = firebase.storage.Storage;

import "rxjs/add/operator/map";
import {Observable} from "rxjs/Observable";
import Reference = firebase.storage.Reference;
/**
 * Created by sebb9 on 28.06.2017.
 */

@Injectable()
export class ProfileService {

  private firebaseStorage: Storage;

  fbProfile : FirebaseObjectObservable<any>;
  profile : Observable<Profile>;


  constructor(private authService : AuthService,
              private afDb: AngularFireDatabase,
              private firebase: FirebaseApp) {

    //init-Function can't be placed here, because DI would execute it before we are logged in at Registry-Page

    this.firebaseStorage = this.firebase.storage();

  }

  public createProfile(profile: Profile) : void {

    //first init object to watch
    this.initFirebaseObject();

    //TODO - place here default Profile-Pic!!!!!

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

  public getProfilePicturePath(email: string): string {
    return 'users/' + email + '/profilePic/';
  }

  public getStorageRootReference(): Reference {
    return this.firebaseStorage.ref();
  }

  public getChildOfReference(ref: Reference, path: string): Reference {
    return ref.child(path);
  }

}
