import {GameService} from "./game.service";
import {Player} from "./player.model";
import {PlayingCard} from "../logic/cards.model";
import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {Lobby} from "./lobby.model";
import {ProfileService} from "../profile/profile.service";
import {SubscriptionService} from "../tabs/subscription.service";
import {PlayerService} from "./player.service";
import {LobbyService} from "./lobby.service";
import {Profile} from "../profile/profile.model";
import {Observable} from "rxjs/Observable";
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
  profileObservable : Observable<Profile>;
  profile : Profile;

  public players: Player[];
  public table: PlayingCard[];
  constructor(private navParams: NavParams,
              private lobbyService: LobbyService,
              private playerService: PlayerService,
              private profileService: ProfileService,
              private subscriptionService: SubscriptionService,
              private gameService: GameService) {
    this.lobby = this.navParams.data.lobby;
    this.profileObservable = this.profileService.getCurrentProfile();
    console.log(this.lobby);

    this.subscriptionService.addSubscription(
      this.profileService.getCurrentProfile().subscribe(
        (profile: Profile) => {
          this.profile = profile;
          console.log(this.profile);
          this.lobby.players[this.lobby.players.length] = new Player(
            this.profile.name, this.profile.cash, this.profile.email
          );
          this.lobbyService.update(this.lobby);
        }
      )
    );

    //TODO wie kommt man an das Observable von DIESER Lobby ran?
    /*this.subscriptionService.addSubscription(
      this.lobbyService.getObservableLobbies().
    )*/
  }

  //ansatz mit: ionviewdidload(), subscription auf profile,

  public getObservableLobby() {
    let localLobbies = this.lobbyService.getObservableLobbies();
    //return localLobbies.filter((localLobby) => localLobby.id == this.lobby.id)
  }

  ionViewDidEnter(){
    //changeOriantationLandspace()
  }

}
