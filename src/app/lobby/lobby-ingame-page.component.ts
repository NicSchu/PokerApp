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
import {CardbackPickerSerivce} from "../settings/clientOptions_subpages/cardbackPicker.service";

/**
 * Created by Silas on 07.07.2017.
 */

@Component({
  selector: "lobby-ingame-page",
  templateUrl: "lobby-ingame-page.component.html",
  providers: [Logic]
})
export class LobbyIngamePageComponent{
  lobby: Lobby;
  profile : Profile = null;
  canLeave: boolean = false;
  playerNumber: number;
  firstRun : boolean = true;
  loaded: boolean = false;
  private subP; subL;
  cardsFaceUp: boolean = false;
  //public players: Player[];
  //public table: PlayingCard[];

  /*TODO Liste für morgen den 26.07
    - Gewinner anzeigen (popup)
    - Lobby löschen/resetten bei leave
    4. blinds
    5. schülers Cardbacks
    6. Achievements und Runden updaten
  * */

  constructor(private logic: Logic,
              private cardbackPickerPageService: CardbackPickerSerivce,
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
                let oldStat = this.lobby.status;
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
                } else if (this.lobby.showedTableCards != turnedCards
                  && oldStat != "fin" && oldStat != "fin2")
                  this.turnAroundCards(turnedCards);
                if (this.lobby.status == "fin"){
                  if (this.playerNumber == 0){
                    this.endRound();
                  }
                  this.showAllPlayerCards();
                }else{
                  if (this.lobby.status == "new" && this.cardsFaceUp){
                    this.resetCardBacks();
                  }
                }
                if (oldStat == "fin" && this.lobby.status == "fin2"){
                  let alert = this.alertCtrl.create({
                    title: 'Winner:',
                    subTitle: 'Congratulations to ' + this.lobby.lastRoundWinner + "!",
                    buttons: [
                      {
                        text: 'OK'
                      }]
                  });
                  alert.present();
                }
              }
            ));
        }
      )
    );
  }

  ionViewWillLeave(){
    if (this.canLeave) return true;
    this.quitLobby();
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
          }
          //Change the own card(back) so it shows a face of a playing card
          this.showOwnCards();
          this.resetCardBacks();
        }else{
          this.canLeave = true;
          this.closeAndReset();
        }
      });
    modal.present();
  }

  beginRound(){
    let deck = new Deck();
    deck.shuffle();
    this.lobby.currentPlayers = [];
    for (let player of this.lobby.players){
      player.playing = true;
      this.lobby.currentPlayers.push(player);
    }
    for (let player of this.lobby.currentPlayers){
      player.entry = 0;
      player.isCoward = false;
      player.hand = [];
      player.hand.push(deck.cards.pop());
      player.hand.push(deck.cards.pop());
    }
    this.lobby.tableCards = [];
    for (let i = 0; i < 5; i++){
      this.lobby.tableCards.push(deck.cards.pop());
    }
    this.lobby.lastRoundWinner = "";
    this.lobby.currentMaxEntry = 0;
    this.lobby.pot = 0;
    this.lobby.showedTableCards = 0;
    //TODO setze Smallblind
    this.lobby.smallBlind = (this.lobby.smallBlind+1)%this.lobby.currentPlayers.length;
    this.lobby.playerWithLastRaise = (this.lobby.smallBlind+1)%this.lobby.currentPlayers.length;
    this.lobby.activePlayer = (this.lobby.smallBlind+2)%this.lobby.currentPlayers.length;

    this.setBlinds(this.lobby.players);
    this.lobby.playerWithLastRaise = (this.lobby.playerWithLastRaise+1)%this.lobby.currentPlayers.length;
    //this.setBlinds(this.lobby.currentPlayers);
    this.resetCardBacks();
    this.lobbyService.update(this.lobby);
  }

  setBlinds(player: Player[]){
    this.lobby.pot += 75; //25+50
    this.lobby.currentMaxEntry = 50;
    player[this.lobby.smallBlind].cash -= 25;
    player[this.lobby.smallBlind].entry = 25;
    player[this.lobby.playerWithLastRaise].cash -= 50;
    player[this.lobby.playerWithLastRaise].entry = 50;
  }

  resetCardBacks(){
    /*
     * set all cards to backs
     * */
    let path = this.cardbackPickerPageService.getCardbackUrlFromProfile(this.profile);
    for (let i = 0; i < 5; i++)
      this.changeImgSrc(path,"table"+i);

    this.showOwnCards();
    for (let i = 2; i < this.lobby.currentPlayers.length+1; i++){
      for (let j = 0; j < 2; j++)
        this.changeImgSrc(path,"p"+i+""+j);
    }
    this.lobby.status = "new";
    this.cardsFaceUp = false;
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
    this.lobby.currentPlayers.splice(this.playerNumber,1);

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
    let activePlayer = this.lobby.currentPlayers.filter(
      (player) => {return !player.isCoward}
    );
    if (activePlayer.length == 1) {
      this.lobby.status = "fin";
      //TODO Spielende
    }else {
      this.next(next);
      if (this.lobby.activePlayer == this.lobby.playerWithLastRaise)
        this.turnAroundCards(this.lobby.showedTableCards);
    }
    this.lobbyService.update(this.lobby);
  }

  next(next: number){
    /*if (next < this.lobby.currentPlayers.length -1){
      next = next + 1;
    }else next = 0;*/
    next = (next+1)%this.lobby.currentPlayers.length;
    if (this.lobby.currentPlayers[next].isCoward) this.next(next);
    else this.lobby.activePlayer = next;
  }

  turnAroundCards(turnedCards: number){
    if (turnedCards == 0) {
      this.changeImgSrc(this.buildPicPath(this.lobby.tableCards[0]),"table0");
      this.changeImgSrc(this.buildPicPath(this.lobby.tableCards[1]),"table1");
      this.changeImgSrc(this.buildPicPath(this.lobby.tableCards[2]),"table2");
      this.lobby.showedTableCards = 3;
    }
    else if (turnedCards == 3) {
      this.changeImgSrc(this.buildPicPath(this.lobby.tableCards[3]),"table3");
      this.lobby.showedTableCards = 4;
    }
    else if (turnedCards == 4) {
      this.changeImgSrc(this.buildPicPath(this.lobby.tableCards[4]),"table4");
      this.lobby.showedTableCards = 5;
    }else{
      this.lobby.status = "fin";
      this.lobbyService.update(this.lobby);
    }
  }

  showOwnCards(){
    this.changeImgSrc(this.buildPicPath(this.lobby.players[this.playerNumber].hand[0]),"self0");
    this.changeImgSrc(this.buildPicPath(this.lobby.players[this.playerNumber].hand[1]),"self1");
  }

  showAllPlayerCards(){
    for (let i = this.lobby.showedTableCards-1; i < 5; i++)
      this.changeImgSrc(this.buildPicPath(this.lobby.tableCards[i]),"table"+i);

    for (let i = 2; i < this.lobby.currentPlayers.length+1; i++){
      for (let j = 0; j < 2; j++){
        if (!this.lobby.currentPlayers[i-1].isCoward){
          this.changeImgSrc(this.buildPicPath(this.lobby.currentPlayers[i-1].hand[j]),"p"+i+""+j);
        }
      }

    }
    this.cardsFaceUp = true;
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
            this.callComputation();
            let chips : number = parseInt(data.chips);
            if ((chips > 0) && (chips <= this.lobby.players[this.playerNumber].cash)){
              this.lobby.players[this.playerNumber].cash -= chips;
              this.lobby.currentPlayers[this.playerNumber].cash -= chips;
              this.lobby.pot += chips;
              this.lobby.currentMaxEntry += chips;
              this.lobby.players[this.playerNumber].entry += chips;
              this.lobby.playerWithLastRaise = this.playerNumber;
            }else return false;
            this.nextPlayersTurn();
          }
        }]
    });
    alert.present();
  }

  callComputation(){
    let call = this.lobby.currentMaxEntry - this.lobby.players[this.playerNumber].entry;
    if (call == 0) return;
    if (this.lobby.players[this.playerNumber].cash >= call){
      this.lobby.players[this.playerNumber].cash -= call;
      this.lobby.pot += call;
    }else{
      // All-In
      call = this.lobby.players[this.playerNumber].cash;
      this.lobby.pot += call;
      this.lobby.players[this.playerNumber].cash = 0;
    }
    this.lobby.currentPlayers[this.playerNumber].cash = this.lobby.players[this.playerNumber].cash;
    this.lobby.players[this.playerNumber].entry += call;
  }

  //muss ich mindestens machen, um im Spiel zu bleiben.
  //geht nicht, wenn keiner geraised hat
  call(){
    this.callComputation();
    this.nextPlayersTurn();
  }

  //Geht immer -> aussteigen
  pass(){
    this.lobby.players[this.playerNumber].isCoward = true;
    this.nextPlayersTurn();
  }

  endRound(){
    let possibleWinners = this.lobby.currentPlayers.filter(
      (player) => {return !player.isCoward}
    );
    let winners: number[] = [0];
    if (possibleWinners.length > 1){
     let ratings: HandRating[] = [];
      for (let player of possibleWinners){
        ratings.push(this.logic.rateHand(this.lobby.tableCards, player.hand));
      }
      console.log(ratings);
      for (let i = 1; i < ratings.length; i++){
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
      for (let player of this.lobby.players){
        if (player.id == possibleWinners[index].id) {
          player.cash += this.lobby.pot / winners.length;
          this.lobby.lastRoundWinner += player.name + "\n";
        }
      }
      console.log(possibleWinners[index]);
    }
    let alert = this.alertCtrl.create({
      title: 'Winner:',
      subTitle: 'Congratulations to ' + this.lobby.lastRoundWinner + "!",
      buttons: [
        {
          text: 'OK'
        }]
    });
    alert.present();

    this.lobby.status = "fin2";
    this.lobbyService.update(this.lobby);
  }

  changeImgSrc(path:string, id:string){
    let img = document.getElementById(id) as HTMLImageElement
    if (img) img.src = path;
  }

  buildPicPath(pc: PlayingCard):string{
    let str ="assets/svg/Cards/";
    str += pc.color;
    str += pc.value;
    str += ".svg";
    return str;
  }
}
