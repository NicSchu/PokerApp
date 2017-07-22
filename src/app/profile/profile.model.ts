
/**
 * Created by sebb9 on 08.06.2017.
 */
export class Profile {

  //TODO - insert attribute for cardbackURL
  constructor(public name: string,
              public email: string,
              public profilePicture?: string,
              public cash :number = 10000,
              public friends: string[] = [],
              public accAchievements: string[] = [], //contains id´s of accomplished achievements
              public roundsPlayed: number = 0) {
  }

  public static createWith(profile : any) : Profile{
    return new Profile(profile.name, profile.email, profile.profilePicture, profile.cash, profile.friends, profile.accAchievements, profile.roundsPlayed)
  }

}
