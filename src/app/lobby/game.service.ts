

import {Player} from "./player.model";
import {PlayingCard} from "../logic/cards.model";
import {Deck} from "./deck.model";

export class GameService {
  turnCounter: number = 0;

  constructor(public deck: Deck = new Deck,
              public pot : number = 0,
              public table: PlayingCard[] = new PlayingCard[5],
              public players : Player[] = []) {}

  initializeRound() {
    this.deck.shuffle();

    for (let i = 0; i < this.players.length; i++) {
      this.players[i].hand[1] = this.deck.card.pop();
      this.players[i].hand[2] = this.deck.card.pop();
    }
    for (let i = 0; i < 5; i++) {
      this.table[i] = this.deck.card.pop();
    }
  }

  reset() {
    this.deck.reCreateDeck();
  }
}
