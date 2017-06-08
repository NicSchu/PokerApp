import {Login} from "../login/login.model";
import {Achievement} from "../achievements/achievement.model";
/**
 * Created by sebb9 on 08.06.2017.
 */
export class Profile {

  constructor(public login: Login,
              public name: string,
              public cash :number,
              public friends?: Profile[],
              public achievements?: Achievement[],
              public roundsPlayed?: number) {
  }

  public getAccomplishedAchievements() : number {
    return this.achievements.filter(e => e.accomplished).length;
  }

}
