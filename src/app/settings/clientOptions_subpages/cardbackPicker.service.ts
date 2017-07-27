import {Injectable} from "@angular/core";
import {FirebaseApp} from "angularfire2";

import "firebase/storage";
import * as firebase from "firebase/app";
import {Profile} from "../../profile/profile.model";
import Storage = firebase.storage.Storage;

import Reference = firebase.storage.Reference;

@Injectable()
export class CardbackPickerSerivce {

  private firebaseStorage: Storage;

  constructor(private firebase: FirebaseApp){
    this.firebaseStorage = this.firebase.storage();

  }

  public getCardbackPath(email : string) : string {
    return 'users/' + email + '/cardback/';
  }

  public getStorageRootReference(): Reference {
    return this.firebaseStorage.ref();
  }

  public getChildOfReference(ref: Reference, path: string): Reference {
    return ref.child(path);
  }

  public setDefaultCardback() {
    //NOTE!!! only use in createProfile from profileService
    let defaultCardbackPath = this.getStorageRootReference();
    defaultCardbackPath = this.getChildOfReference(defaultCardbackPath, 'default/cardback/default.svg');
    return defaultCardbackPath.getDownloadURL();
  }

  //diese methode für die player.cardback benutzen
  public getCardbackUrlFromProfile(profile : Profile) : string {
    if(profile.usingDefaultCardback) {
      return "https://firebasestorage.googleapis.com/v0/b/poker-b817e.appspot.com/o/default%2Fcardback%2Fdefault.svg?alt=media&token=bd39ef90-49ee-46ac-92af-78997814d0dc";
    } else {
      return profile.cardback;
    }
  }
}
