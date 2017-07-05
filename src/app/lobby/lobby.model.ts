import {Player} from "./player.model";
import {Deck} from "./deck.model";
/**
 * Created by sebb9 on 01.07.2017.
 */
export class Lobby {

  constructor(public id?: string,
              public name? : string,
              public status? : string, //TODO - ist das Attribut wirklich notwendig???
              public deck: Deck = new Deck(),
              public pot : number = 0,
              public players : Player[] = []) { //TODO - satus evtl duch klasse ersetzen, mit static => Enum

  }

  public static createWith(lobby: any) : Lobby {
    return Object.assign(new Lobby(), lobby);
  }

}
