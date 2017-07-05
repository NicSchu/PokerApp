/**
 * Created by sebb9 on 01.07.2017.
 */
import {PlayingCard} from "../logic/cards.model";

export class Deck {
  cards: PlayingCard[] = [];
  constructor() {
    this.reCreateDeck();
  }

  reCreateDeck() {
    for (let i = 0; i <= 3; i++) {
      for (let j = 2; j <= 14; j++) {
        // this.cards.push(new PlayingCard(j,i));
      }
    }
  }

  shuffle() {
    let j, x;
    for (let i = this.cards.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = this.cards[i - 1];
      this.cards[i - 1] = this.cards[j];
      this.cards[j] = x;
    }
  }
}
