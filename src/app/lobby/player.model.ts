/**
 * Created by sebb9 on 01.07.2017.
 */
import {PlayingCard} from "../logic/cards.model";
import {Profile} from "../profile/profile.model";

export class Player {
  constructor(public name: string,
              public cash: number,
              public id: string,
              public hand?: PlayingCard[]) {
  }

  static createWith(player: any) {
    return new Player(player.name, player.cash, player.id, player.hand);
  }

}
