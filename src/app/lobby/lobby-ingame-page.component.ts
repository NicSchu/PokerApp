import {GameService} from "./game.service";
import {Player} from "./player.model";
import {PlayingCard} from "../logic/cards.model";
import {Component} from "@angular/core";
import {selector} from "rxjs/operator/multicast";
import {NavParams} from "ionic-angular";
import {Lobby} from "./lobby.model";
/**
 * Created by Silas on 07.07.2017.
 */

@Component({
  selector: "lobby-ingame-page",
  templateUrl: "lobby-ingame-page.component.html"
})
export class LobbyIngamePageComponent{
  showedTableCards: number = 1;
  lobby: Lobby;
  constructor(public gameService: GameService,
              public players: Player[],
              table: PlayingCard[],
              private navParams: NavParams) {
    this.lobby = this.navParams.data;
    console.log(typeof this.navParams.data);
    console.log(typeof this.lobby);
  }

  ionViewDidEnter(){
    //changeOriantationLandspace()
  }

}
