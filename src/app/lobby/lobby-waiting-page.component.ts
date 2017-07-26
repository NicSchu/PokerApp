/**
 * Created by Nicolai on 23.07.2017.
 */
import {Component} from "@angular/core";
import {Lobby} from "./lobby.model";
import {SubscriptionService} from "../tabs/subscription.service";
import {LobbyService} from "./lobby.service";
import {NavParams, ViewController} from "ionic-angular";
import {Profile} from "../profile/profile.model";

@Component({
  selector: "lobby-waiting-page",
  templateUrl: "lobby-waiting-page.component.html"
})
export class LobbyWaitingPageComponent {
  private lobby = new Lobby();
  private playerNumber: number = -1;
  private profile : Profile;
  private sub;

  constructor(public viewCtrl: ViewController,
              private navParams: NavParams,
              private subscriptionService: SubscriptionService,
              private lobbyService: LobbyService){
    this.lobby = this.navParams.data.lobby;
    this.profile = this.navParams.data.profile;

    //TODO definiere endGame, um started Lobby zurückzusetzen
    this.subscriptionService.addSubscription(
      this.sub = this.lobbyService.getLobbyById(this.lobby.id).subscribe(
        (lobby: Lobby) => {
          this.lobby = lobby;
          for (let i = 0; i < lobby.players.length; i++){
            if (lobby.players[i].id == this.profile.email){
              this.playerNumber = i;
              break;
            }
          }
          if (this.playerNumber != 0 && lobby.gameStarted && this.lobby.players[this.playerNumber].playing) this.leaveWaiting(true);
        }
      )
    );
  }

  leaveWaiting(start: boolean){
    this.sub.unsubscribe();
    this.subscriptionService.removeSubscription(this.sub);
    this.viewCtrl.dismiss(start);
  }
}
