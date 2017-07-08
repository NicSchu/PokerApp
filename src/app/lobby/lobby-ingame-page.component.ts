import {GameService} from "./game.service";
import {Player} from "./player.model";
import {PlayingCard} from "../logic/cards.model";
import {Component} from "@angular/core";
import {selector} from "rxjs/operator/multicast";
import {NavParams} from "ionic-angular";
import {Lobby} from "./lobby.model";
import {ProfileService} from "../profile/profile.service";
import {SubscriptionService} from "../tabs/subscription.service";
import {PlayerService} from "./player.service";
import {LobbyService} from "./lobby.service";
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
  public players: Player[];
  public table: PlayingCard[];
  constructor(private navParams: NavParams,
              private lobbyService: LobbyService,
              playerService: PlayerService,
              profileService: ProfileService,
              subscriptionService: SubscriptionService,
              public gameService: GameService) {
    this.lobby = this.navParams.data.lobby;
    //gameService.pushPlayer(playerService.createNewPlayer());
    gameService.pushPlayers(this.lobby)
  }

  public getObservableLobby() {
    let localLobbies = this.lobbyService.getObservableLobbies();

  }

  ionViewDidEnter(){
    //changeOriantationLandspace()
  }

}
