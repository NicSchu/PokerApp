/**
 * Created by sebb9 on 01.07.2017.
 */
import {PlayingCard} from "../logic/cards.model";

export class Player {
  constructor(public name: string,
              public cash: number,
              public id: string,
              public playing: boolean = false,
              public entry: number = 0,
              public isCoward: boolean = false,
              //public achievements: string[],
              //public roundsPlayed: number,
              public hand: PlayingCard[] = null) {
  }

  static createWith(player: any) {
    let newPlayer = new Player(null, null, /*null, null,*/ null);
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
