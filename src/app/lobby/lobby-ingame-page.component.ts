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
import {Logic} from "../logic/logic";
import {HandRating} from "../logic/hand-rating.module";
/**
 * Created by Silas on 07.07.2017.
 */

@Component({
  selector: "lobby-ingame-page",
  templateUrl: "lobby-ingame-page.component.html",
  providers: [Logic]
})
export class LobbyIngamePageComponent{
  playerWithLastRaise: number = 0;
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
    4. Logic einbinden und Sieger bestimmen
    5. Andere Siegfälle klären (alle leaven oder alle passen)
    6. Achievements und Runden updaten
  * */

  constructor(private logic: Logic,
              private navParams: NavParams,
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
                  this.turnAroundCards(turnedCards);
                if (this.lobby.status == "fin" && this.playerNumber == 0){
                  this.endRound();
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
            console.log(this.lobby.players);
            this.beginRound();
            this.lobbyService.update(this.lobby);
          }

          //Change the own card(back) so it shows a face of a playing card
          let self = document.getElementById("self0") as HTMLImageElement;
          self.src = this.buildPicPath(this.lobby.players[this.playerNumber].hand[0]);
          self = document.getElementById("self1") as HTMLImageElement;
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
    /*
    * set all cards to backs
    * */
    if (this.lobby.status != null){
      let path = "assets/svg/cardbacks/custom1.svg";
      let img;
      for (let i = 0; i < 5; i++){
        img = document.getElementById("table"+i) as HTMLImageElement;
        img.src = path;
      }
      img = document.getElementById("self0") as HTMLImageElement;
      img.src = path;
      img = document.getElementById("self1") as HTMLImageElement;
      img.src = path;
      for (let i = 2; i < 6; i++){
        for (let j = 0; j < 2; j++){
          img = document.getElementById("p"+i+j) as HTMLImageElement;
          img.src = path;
        }
      }
    }
    this.lobby.status = "";
    for (let player of this.lobby.players) player.playing = true;
    for (let player of this.lobby.players){
      if (player.playing){
        player.entry = 0;
        player.isCoward = false;
        player.hand = [];
        player.hand.push(deck.cards.pop());
        player.hand.push(deck.cards.pop());
      }
    }
    this.lobby.tableCards = [];
    for (let i = 0; i < 5; i++){
      this.lobby.tableCards.push(deck.cards.pop());
    }
    //TODO mach irgendwas mit smallblind/bigblind
    this.lobby.activePlayer = 0;
    this.lobby.currentMaxEntry = 0;
    this.lobby.pot = 0;
    this.lobby.showedTableCards = 0;
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
    this.loaded = false;
    this.lobby.players.splice(this.playerNumber,1);

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
      this.triggerHost();
    }else this.next(next);

    if (this.lobby.activePlayer == this.playerWithLastRaise)
      this.turnAroundCards(this.lobby.showedTableCards);

    this.lobbyService.update(this.lobby);
  }

  next(next: number){
    if (next < this.lobby.players.length -1 && this.lobby.players[next+1].playing){
      next = next + 1;
    }else next = 0;
    if (this.lobby.players[next].isCoward) this.next(next);
    else this.lobby.activePlayer = next;
  }

  turnAroundCards(turnedCards: number){
    if (turnedCards == 0) {
      let table = document.getElementById("table0") as HTMLImageElement;
      table.src = this.buildPicPath(this.lobby.tableCards[0]);
      table = document.getElementById("table1") as HTMLImageElement;
      table.src = this.buildPicPath(this.lobby.tableCards[1]);
      table = document.getElementById("table2") as HTMLImageElement;
      table.src = this.buildPicPath(this.lobby.tableCards[2]);
      this.lobby.showedTableCards = 3;
    }
    else if (turnedCards == 3) {
      let table = document.getElementById("table3") as HTMLImageElement;
      table.src = this.buildPicPath(this.lobby.tableCards[3]);
      this.lobby.showedTableCards = 4;
    }
    else if (turnedCards == 4) {
      let table = document.getElementById("table4") as HTMLImageElement;
      table.src = this.buildPicPath(this.lobby.tableCards[4]);
      this.lobby.showedTableCards = 5;
    }else{
      this.triggerHost();
    }
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
          //TODO bevor Raise ausgeführt wird, muss gegebenenfalls gecalled werden
          text: 'Raise',
          handler: (data) => {
            let chips : number = parseInt(data.chips);
            if ((chips > 0) && (chips <= this.lobby.players[this.playerNumber].cash)){
              this.lobby.players[this.playerNumber].cash -= chips;
              this.lobby.pot += chips;
              this.lobby.currentMaxEntry += chips;
              this.lobby.players[this.playerNumber].entry += chips;
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
      this.lobby.players[this.playerNumber].cash -= call;
      this.lobby.pot += call;
    }else{
      // All-In
      call = this.lobby.pot += this.lobby.players[this.playerNumber].cash;
      this.lobby.pot += call;
      this.lobby.players[this.playerNumber].cash = 0;
    }
    this.lobby.players[this.playerNumber].entry += call;
    this.nextPlayersTurn();
  }

  //Geht immer -> aussteigen
  pass(){
    this.lobby.players[this.playerNumber].isCoward = true;
    this.nextPlayersTurn();
  }

  triggerHost(){
    this.lobby.status = "fin";
    this.lobbyService.update(this.lobby);
  }

  endRound(){
    let possibleWinners = this.lobby.players.filter(
      (player) => {return !player.isCoward && player.playing}
    );
    let winners: number[] = [0];
    if (possibleWinners.length > 1){
     let ratings: HandRating[] = [];
      for (let player of possibleWinners){
        ratings.push(this.logic.rateHand(this.lobby.tableCards, player.hand));
      }
      console.log(ratings);
      for (let i = 1; i < ratings.length-1; i++){
        switch (ratings[winners[0]].compare(ratings[i])){
          case -1: winners = [i];
            break;
          case  0: winners.push(i);
            break;
        }
      }
    }
    for (let index of winners){
      possibleWinners[index].cash += this.lobby.pot/winners.length;
      console.log(possibleWinners[index]);
    }
  }

  buildPicPath(pc: PlayingCard):string{
    let str ="assets/svg/Cards/";
    str += pc.color;
    str += pc.value;
    str += ".svg";
    return str;
  }
}
