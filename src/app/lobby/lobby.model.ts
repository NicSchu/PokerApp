import {Player} from "./player.model";
import {PlayingCard} from "../logic/cards.model";
/**
 * Created by sebb9 on 01.07.2017.
 */
export class Lobby {

  constructor(public id?: string,
              public name? : string,
              public status? : string, //TODO - ist das Attribut wirklich notwendig???
              public tableCards: PlayingCard[] = [],
              public smallBlind: number = 0,
              public lastRoundWinner: Player = null, //die 5 ist niemand! niemand hat gewonnen
              public currentMaxEntry: number = 0,
              public showedTableCards: number = 0,
              public pot : number = 0,
              public activePlayer : number = 0,
              public gameStarted: boolean = false,
              public players : Player[] = []) {
    //TODO - satus evtl duch klasse ersetzen, mit static => Enum
  }

  public static createWith(lobby: any) : Lobby {
    return Object.assign(new Lobby(), lobby);
  }

}
