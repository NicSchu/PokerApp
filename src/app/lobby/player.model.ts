/**
 * Created by sebb9 on 01.07.2017.
 */
import {LogicPageComponent} from "../logic/logicService";
import {PlayingCard} from "../logic/cards.model";

export class Player {

  public hand: PlayingCard[];
  constructor(private logicMoudule: LogicPageComponent) {

  }

}
