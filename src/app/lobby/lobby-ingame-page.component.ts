import {GameService} from "./game.service";
import {Player} from "./player.model";
import {PlayingCard} from "../logic/cards.model";
/**
 * Created by Silas on 07.07.2017.
 */

export class IngameLobby{
  showedTableCards: number = 1;
  constructor(public gameService: GameService,
              public players: Player[],
              table: PlayingCard[]){

  }
  gameWalkTrhough() {

  }

}
