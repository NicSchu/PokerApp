/**
 * Created by sebb9 on 01.07.2017.
 */
import {PlayingCard} from "../logic/cards.model";

export class Deck {
  card: PlayingCard[]
  constructor() {
    for (let i = 0; i <= 3; i++) {
      for (let j = 1; j <= 13; j++) {
        this.card[i*14 + j].value = j+1
        this.card[i*14 + j].color = i
      }
    }
  }
}
