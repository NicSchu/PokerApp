import {Player} from "./player.model";
import {PlayingCard} from "../logic/cards.model";
import {Component} from "@angular/core";
import {AlertController, NavParams, NavController, ModalController} from "ionic-angular";
import {Lobby} from "./lobby.model";
import {ProfileService} from "../profile/profile.service";
import {SubscriptionService} from "../tabs/subscription.service";
import {LobbyService} from "./lobby.service";
import {Profile} from "../profile/profile.model";
import {Observable} from "rxjs/Observable";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {LobbyWaitingPageComponent} from "./lobby-waiting-page.component";
import {Deck} from "./deck.model";
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
  profile : Profile = null;
  canLeave: boolean = false;
  playerNumber: number;
  firstRun : boolean = true;
  loaded: boolean = false;
  raiseCash: number;
  private subP; subL;

  //public players: Player[];
  public table: PlayingCard[];

  /*TODO Liste für morgen den 26.07
    2. eigene Karten anzeigen und andere Karten auch nur bei Bedarf anzeigen
    3. Tischkarten nach und nach umdrehen
    4. Logic einbinden und Sieger bestimmen
    5. Andere Siegfälle klären (alle leaven oder alle passen)
    6. Achievements und Runden updaten
    7. Bilder auf Handy fixen
  * */

  constructor(private navParams: NavParams,
              private alertCtrl : AlertController,
              private lobbyService: LobbyService,
              private profileService: ProfileService,
              private subscriptionService: SubscriptionService,
              private navCtrl: NavController,
              private screenOrientation: ScreenOrientation,
              private modalCtrl : ModalController) {
    this.lobby = this.navParams.data.lobby;
  }

  //ansatz mit: ionviewdidload(), subscription auf profile,
  ionViewDidLoad(){
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY);

    this.subscriptionService.addSubscription(
      this.subP = this.profileService.getCurrentProfile().subscribe(
        (profile: Profile) => {
          this.profile = profile;
          this.lobby.players[this.lobby.players.length] = new Player(
            this.profile.name, this.profile.cash, this.profile.email
            /*, this.profile.accAchievements, this.profile.roundsPlayed*/
          );
          this.lobbyService.update(this.lobby);
          //Ist das nicht zu früh?!
          this.loaded = true;
          //TODO Anzeige!
          this.subscriptionService.addSubscription(
            this.subL = this.lobbyService.getLobbyById(this.lobby.id).subscribe(
              (lobby: Lobby) => {
                this.lobby = lobby;
                for (let i = 0; i < lobby.players.length; i++){
                  if (lobby.players[i].id == this.profile.email){
                    this.playerNumber = i;
                    break;
                  }
                }
                if (this.firstRun){
                  this.waitingPage();
                  this.firstRun = false;
                }
              }
            ));
        }
      )
    );
  }

  waitingPage(){
    let modal = this.modalCtrl.create(LobbyWaitingPageComponent, {lobby: this.lobby, profile: this.profile});
    modal.onDidDismiss(
      ready => {
        if (ready){
          if (this.playerNumber == 0) {
            this.lobby.gameStarted = true;
            for (let player of this.lobby.players) player.playing = true;
            console.log(this.lobby.players);
            this.beginRound();
            this.lobbyService.update(this.lobby);
          }
        }else{
          this.canLeave = true;
          this.closeAndReset();
        }
      });
    modal.present();
  }

  ionViewWillLeave(){
    if (this.canLeave) return true;
    this.quitLobby();
  }

  beginRound(){
    let deck = new Deck();
    deck.shuffle();
    for (let player of this.lobby.players){
      if (player.playing){
        player.hand = [];
        player.hand.push(deck.cards.pop());
        player.hand.push(deck.cards.pop());
      }
    }
    for (let i = 0; i < 5; i++){
      this.lobby.tableCards.push(deck.cards.pop());
    }
  }

  quitLobby(){
    let alert = this.alertCtrl.create({
      title: 'Leave Lobby',
      subTitle: 'Are you sure you want to leave the Lobby?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Leave',
          handler: () => {
            this.closeAndReset();
          }
        }]
    });
    alert.present();
  }

  closeAndReset(){
    document.getElementsByClassName('tabbar')[0].setAttribute("display", "true");
    this.screenOrientation.unlock();
    this.canLeave = true;
    this.subscriptionService.removeSubscription(this.subP);
    this.subscriptionService.removeSubscription(this.subL);
    this.subP.unsubscribe();
    this.subL.unsubscribe();

    for (let i = 0; i < this.lobby.players.length; i++){
      if (this.lobby.players[i].id == this.profile.email){
        this.lobby.players.splice(i,1);
        break;
      }
    }
    this.loaded = false;
    this.lobbyService.update(this.lobby);

    this.navCtrl.pop();
  }

  nextPlayersTurn(){
    let next = this.playerNumber;
    let activePlayer = this.lobby.players.filter(
      (player) => {return !player.isCoward && player.playing}
    );
    if (activePlayer.length == 1) {
      //
    }else this.next(next);
    this.lobbyService.update(this.lobby);
  }

  next(next: number){
    if (next < this.lobby.players.length -1 && this.lobby.players[next+1].playing){
      next = next + 1;
    }else next = 0;
    if (this.lobby.players[next].isCoward) this.next(next);
    else this.lobby.activePlayer = next;
  }

  //geht immer, solange in der letzten Runde niemand geraised hat
  //-> Einsatz
  check(){
    this.nextPlayersTurn();
  }

  //geht immer, solange Geld vorhanden
  raise(){
    let alert = this.alertCtrl.create({
      title: 'Raise',
      subTitle: 'How many chips you want to raise?',
      inputs: [
        {
          name: 'chips',
          placeholder: 'Chips'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler:() => {

          }
        },
        {
          text: 'Raise',
          handler: (data) => {
            let chips : number = parseInt(data.chips);
            if (chips <= this.lobby.players[this.playerNumber].cash){
              this.lobby.players[this.playerNumber].cash -= chips;
              this.lobby.pot += chips;
              this.lobby.currentMaxEntry += chips;
            }else return false;
            this.nextPlayersTurn();
          }
        }]
    });
    alert.present();
  }

  //muss ich mindestens machen, um im Spiel zu bleiben.
  //geht nicht, wenn keiner geraised hat
  call(){
    let call = this.lobby.currentMaxEntry - this.lobby.players[this.playerNumber].entry;
    if (this.lobby.players[this.playerNumber].cash >= call){
      this.lobby.players[this.playerNumber].cash - call;
      this.lobby.pot += call;
    }else{
      this.lobby.pot += this.lobby.players[this.playerNumber].cash;
      this.lobby.players[this.playerNumber].cash = 0;
    }
    this.nextPlayersTurn();
  }

  //Geht immer -> aussteigen
  pass(){
    this.lobby.players[this.playerNumber].isCoward = true;
    this.nextPlayersTurn();
  }
}
