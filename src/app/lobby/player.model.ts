/**
 * Created by sebb9 on 01.07.2017.
 */
import {PlayingCard} from "../logic/cards.model";

export class Player {
  constructor(public name: string,
              public cash: number,
              public id: string,
              public hand?: PlayingCard[]) {
  }

  static createWith(player: any) {
    let newPlayer = new Player(null, null, null);
    for (let i in newPlayer) {
      for (let j in player) {
        if (i == j) {
          newPlayer[i] = player[j];
        }
      }
    }
    return newPlayer
  }
}
