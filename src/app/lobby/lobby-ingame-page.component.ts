import {GameService} from "./game.service";
import {Player} from "./player.model";
import {PlayingCard} from "../logic/cards.model";
import {Component} from "@angular/core";
import {AlertController, NavParams, NavController} from "ionic-angular";
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
  canLeave: boolean = false;

  public players: Player[];
  public table: PlayingCard[];
  constructor(private navParams: NavParams,
              private alterCtrl : AlertController,
              private lobbyService: LobbyService,
              private playerService: PlayerService,
              private profileService: ProfileService,
              private subscriptionService: SubscriptionService,
              private gameService: GameService,
              private navCtrl: NavController) {
    this.lobby = this.navParams.data.lobby;
    this.profileObservable = this.profileService.getCurrentProfile();
    console.log(this.lobby);

    this.subscriptionService.addSubscription(
      this.profileService.getCurrentProfile().subscribe(
        (profile: Profile) => {
          this.profile = profile;
          console.log(this.profile);
          this.lobby.players[this.lobby.players.length] = new Player(
            this.profile.name, this.profile.cash, this.profile.email/*, this.profile.accAchievements, this.profile.roundsPlayed*/
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
  ionViewDidLoad(){

  }

  ionViewWillLeave(){
    if (this.canLeave) return true;
    this.quitLobby();
  }

  quitLobby(){
    //TODO: Button, bzw ganze HTML zum Testen wäre nicht schlecht.
    let alert = this.alterCtrl.create({
      title: 'Leave Lobby',
      subTitle: 'Are you sure you want to leave the Lobby?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Leave',
          handler: () => {
            //TODO kein error handling. funktioniert eben nur über diesen Button
            document.getElementsByClassName('tabbar')[0].setAttribute("display", "true");
            this.canLeave = true;
            this.logoutFromLobby();
            this.navCtrl.pop();
          }
        }]
    });
    alert.present();
  }


  logoutFromLobby(){
    for (let i = 0; i < this.lobby.players.length; i++){
      if (this.lobby.players[i].id == this.profile.email){
        this.lobby.players.splice(i,1);
        break;
      }
    }
    this.lobbyService.update(this.lobby);
  }

  public getObservableLobby() {
    let localLobbies = this.lobbyService.getObservableLobbies();
    //return localLobbies.filter((localLobby) => localLobby.id == this.lobby.id)
  }

  ionViewDidEnter(){
    //changeOriantationLandspace()
  }

}
