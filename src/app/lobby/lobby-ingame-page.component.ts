import {GameService} from "./game.service";
import {Player} from "./player.model";
import {PlayingCard} from "../logic/cards.model";
import {Component} from "@angular/core";
import {selector} from "rxjs/operator/multicast";
import {NavParams} from "ionic-angular";
import {Lobby} from "./lobby.model";
import {ProfileService} from "../profile/profile.service";
import {SubscriptionService} from "../tabs/subscription.service";
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
              profileService: ProfileService,
              subscriptionService: SubscriptionService,
              public gameService: GameService) {
    this.lobby = this.navParams.data.lobby;
    gameService.update(new Player(profileService, subscriptionService));
    gameService.pushPlayers(this.lobby)
  }

  ionViewDidEnter(){
    //changeOriantationLandspace()
  }

}
