import {Achievement} from "../achievements/achievement.model";
/**
 * Created by sebb9 on 08.06.2017.
 */
export class Profile {

  constructor(public name: string,
              public cash :number = 10000,
              public friends: string[] = [],
              public achievements: Achievement[] = [],
              public roundsPlayed: number = 0) {
  }

  public getAccomplishedAchievements() : number {
    return this.achievements.filter(e => e.accomplished).length;
  }

  public static createWith(profile : any) : Profile{
    return new Profile(profile.name, profile.cash, profile.friends, profile.achievements, profile.roundsPlayed)
  }

}
