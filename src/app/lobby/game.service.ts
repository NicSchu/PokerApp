import {PlayingCard} from "../logic/cards.model";
import {Deck} from "./deck.model";
import {AngularFireDatabase, FirebaseObjectObservable} from "angularfire2/database";
import {Injectable} from "@angular/core";

@Injectable()
export class GameService {
  //private turnCounter: number = 0;
  private fbDeck: FirebaseObjectObservable<any>;
  public deck: Deck = new Deck();
  public activePlayer: FirebaseObjectObservable<any>;
  public table: PlayingCard[] = [];
  //public players : Observable<Player[]>;
  //public fbPlayers: FirebaseListObservable<any[]>;

  constructor(private afDb : AngularFireDatabase) {
  }


  initializeRound() {
    this.deck = this.initFirebaseObject();
    this.deck.shuffle();
    this.fbDeck.set(this.copyAndPrepareDeck(this.deck));

    /*for (let i = 0; i < this.players.length; i++) {
      //this.players[i].hand[1] = this.fbDeck.cards.pop();
      //this.players[i].hand[2] = this.deck.cards.pop();
    }*/
    for (let i = 0; i < 5; i++) {
      this.table[i] = this.deck.cards.pop();
    }
  }

  reset() {
    //this.deck.reCreateDeck();
  }

  private initFirebaseObject() {
    //user must be logged in!
    if (!this.fbDeck) {
      this.fbDeck = this.afDb.object('lobbies/deck');
      //console.log(this.fbDeck);

      this.deck = Deck.createWith(this.fbDeck)
      return this.deck;
    }
  }

  private copyAndPrepareDeck(deck: any) : Deck {
    let newDeck = Deck.createWith(deck);
    newDeck.cards = newDeck.cards || null;
    return newDeck;
  }

  /*private copyAndPreparePlayer(player: any): Player {
    let newPlayer = Player.createWith(player);
    newPlayer.name = newPlayer.name || null;
    newPlayer.cash = newPlayer.cash || null;
    newPlayer.hand = newPlayer.hand || null;
    newPlayer.id = newPlayer.id || null;
    return newPlayer;
  }*/
}
