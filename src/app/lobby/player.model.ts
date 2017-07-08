/**
 * Created by sebb9 on 01.07.2017.
 */
import {PlayingCard} from "../logic/cards.model";
import {Profile} from "../profile/profile.model";

export class Player {
  constructor(public cash: number,
              public id: string,
              public profile: Profile,
              public hand?: PlayingCard[]) {
    this.cash = profile.cash;
    this.id = profile.email;
  }

  static createWith(player: any) {
    return player();
  }

}
