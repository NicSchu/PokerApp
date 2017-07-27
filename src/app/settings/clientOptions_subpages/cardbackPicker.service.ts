import {Injectable} from "@angular/core";
import {FirebaseApp} from "angularfire2";
import {AngularFireDatabase} from "angularfire2/database/database";

import "firebase/storage";
import * as firebase from "firebase/app";
import Storage = firebase.storage.Storage;

import Reference = firebase.storage.Reference;

@Injectable()
export class CardbackPickerSerivce {

  private firebaseStorage: Storage;

  constructor(private afDb: AngularFireDatabase,
              private firebase: FirebaseApp){
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
}
