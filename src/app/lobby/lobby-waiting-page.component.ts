/**
 * Created by Nicolai on 23.07.2017.
 */
import {Component} from "@angular/core";
import {Lobby} from "./lobby.model";
import {SubscriptionService} from "../tabs/subscription.service";
import {LobbyService} from "./lobby.service";
import {NavParams, ViewController} from "ionic-angular";

@Component({
  selector: "lobby-waiting-page",
  templateUrl: "lobby-waiting-page.component.html"
})
export class LobbyWaitingPageComponent {
  private lobby = new Lobby();

  constructor(public viewCtrl: ViewController,
              private navParams: NavParams,
              private subscriptionService: SubscriptionService,
              private lobbyService: LobbyService){
    this.lobby = this.navParams.data.lobby;

    this.subscriptionService.addSubscription(
      this.lobbyService.getLobbyById(this.lobby.id).subscribe(
        (lobby: Lobby) => {
          this.lobby = lobby;
        }
      ));
  }
}
