/**
 * Created by sebb9 on 07.07.2017.
 */
import {Injectable} from "@angular/core";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {Profile} from "../profile/profile.model";
import "rxjs/add/operator/map";

@Injectable()
export class FriendsService {

  private fbAllProfiles: FirebaseListObservable<any[]>;
  private allProfiles: Observable<Profile[]>;


  constructor(private afDb: AngularFireDatabase) {
    this.fbAllProfiles = afDb.list('/users');

    this.allProfiles = this.fbAllProfiles.map(
      (fbLobbies: any[]): Profile[] => {
        return fbLobbies.map(
          (fbItem => {
            let profile = Profile.createWith(fbItem.profile);
            return profile;
          })
        )
      }
    );

  }

  public findAll(): Observable<Profile[]> {
    return this.allProfiles;
  }


}
