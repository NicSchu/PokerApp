import {Player} from "./player.model";
import {PlayingCard} from "../logic/cards.model";
import {Component} from "@angular/core";
import {AlertController, NavParams, NavController, ModalController} from "ionic-angular";
import {Lobby} from "./lobby.model";
import {ProfileService} from "../profile/profile.service";
import {SubscriptionService} from "../tabs/subscription.service";
import {LobbyService} from "./lobby.service";
import {Profile} from "../profile/profile.model";
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
  playerWithLastRaise: number = 0;
  //showedTableCards: number = 0;
  lobby: Lobby;
  profile : Profile = null;
  canLeave: boolean = false;
  playerNumber: number;
  firstRun : boolean = true;
  loaded: boolean = false;
  private subP; subL;

  //public players: Player[];
  public table: PlayingCard[];

  /*TODO Liste für morgen den 26.07
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
                let turnedCards = this.lobby.showedTableCards;
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
                } else if (this.lobby.showedTableCards != turnedCards)
                    this.turnAroundCards(turnedCards)

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

          //Change the own card(back) so it shows a face of a playing card
          let self = document.getElementById("self1") as HTMLImageElement;
          self.src = this.buildPicPath(this.lobby.players[this.playerNumber].hand[0]);
          self = document.getElementById("self2") as HTMLImageElement;
          self.src = this.buildPicPath(this.lobby.players[this.playerNumber].hand[1]);
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
    this.profile.cash = this.lobby.players[this.playerNumber].cash;
    this.lobby.players.splice(this.playerNumber,1);

    /*for (let i = 0; i < this.lobby.players.length; i++){
      if (this.lobby.players[i].id == this.profile.email){
        this.lobby.players.splice(i,1);
        break;
      }
    }*/
    this.loaded = false;
    this.lobbyService.update(this.lobby);

    this.subscriptionService.removeSubscription(this.subP);
    this.subscriptionService.removeSubscription(this.subL);
    this.subP.unsubscribe();
    this.subL.unsubscribe();

    this.navCtrl.pop();
    this.profileService.update(this.profile);
  }

  nextPlayersTurn(){
    let next = this.playerNumber;
    let activePlayer = this.lobby.players.filter(
      (player) => {return !player.isCoward && player.playing}
    );
    if (activePlayer.length == 1) {
      this.endRound();
    }else this.next(next);

    if (this.lobby.activePlayer == this.playerWithLastRaise)
      this.turnAroundCards(this.lobby.showedTableCards);

    this.lobbyService.update(this.lobby);
  }

  turnAroundCards(turnedCards: number){
    if (turnedCards == 0) {
      let table = document.getElementById("table1") as HTMLImageElement;
      table.src = this.buildPicPath(this.lobby.tableCards[1]);
      table = document.getElementById("table2") as HTMLImageElement;
      table.src = this.buildPicPath(this.lobby.tableCards[2]);
      table = document.getElementById("table3") as HTMLImageElement;
      table.src = this.buildPicPath(this.lobby.tableCards[3]);
      this.lobby.showedTableCards = 3;
      //this.showedTableCards = 3;
      //this.lobbyService.update(this.lobby);
    }
    else if (turnedCards == 3) {
      let table = document.getElementById("table4") as HTMLImageElement;
      table.src = this.buildPicPath(this.lobby.tableCards[4]);
      this.lobby.showedTableCards = 4;
      //this.showedTableCards = 4;
      //this.lobbyService.update(this.lobby);
    }
    else if (turnedCards == 4) {
      let table = document.getElementById("table5") as HTMLImageElement;
      table.src = this.buildPicPath(this.lobby.tableCards[5]);
      this.lobby.showedTableCards = 5;
      //this.showedTableCards = 5;
      //this.lobbyService.update(this.lobby);
    }
    else this.endRound();
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
            if ((chips > 0) && (chips <= this.lobby.players[this.playerNumber].cash)){
              this.lobby.players[this.playerNumber].cash -= chips;
              this.lobby.pot += chips;
              this.lobby.currentMaxEntry += chips;
              this.playerWithLastRaise = this.playerNumber;
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

  //TODO
  endRound(){

  }

  buildPicPath(pc: PlayingCard):string{
    let str ="assets/svg/Cards/";
    str += pc.color;
    str += pc.value;
    str += ".svg";
    console.log(str);
    return str;
  }
}
