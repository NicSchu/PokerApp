import {Injectable} from "@angular/core";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {Achievement} from "./achievement.model";
/**
 * Created by sebb9 on 29.06.2017.
 */

@Injectable()
export class AchievementService {

  fbAllAchievements : FirebaseListObservable<any[]>;
  allAchievements : Observable<Achievement[]>;


  constructor(afDb: AngularFireDatabase) {

    this.fbAllAchievements = afDb.list('/achievements');
  }


  public createNewAchievement(achievement : Achievement) : void {



  }


}
