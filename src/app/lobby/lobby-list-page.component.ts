import {Component, ViewChild} from "@angular/core";
import {LobbyService} from "./lobby.service";
import {Lobby} from "./lobby.model";
import {ModalController, NavController, Searchbar} from "ionic-angular";
import {SubscriptionService} from "../tabs/subscription.service";
import {LobbyCreationPageComponent} from "./lobby-creation-page.component";
import {LocalStorageService} from "../common/local-storage.service";
import {LobbyIngamePageComponent} from "./lobby-ingame-page.component"
import {Profile} from "../profile/profile.model";
import {ProfileService} from "../profile/profile.service";
/**
 * Created by sebb9 on 08.06.2017.
 */


@Component({
  selector:'lobby-list-page',
  templateUrl: 'lobby-list-page.component.html'
})
export class LobbyListPageComponent {

  private lobbies : Lobby[];
  private filteredLobbies : Lobby[];
  private showSearchbar: boolean = false;
  private searchQuery : string = '';
  private profile: Profile = null;

  private maxPlayerConst : number = 5;

  constructor(private profileService: ProfileService,
              private lobbyService : LobbyService,
              private subscriptionService: SubscriptionService,
              private modalCtrl : ModalController,
              private localStorageService : LocalStorageService,
              private navCtrl: NavController) { //localStorageService is used in the HTML file (<ion-navbar> tag)
      //TODO - wir müssen uns noch überlegen, wann und wie die Lobbies wieder gelöscht werden....
  }

  @ViewChild(Searchbar)
  private searchbar : Searchbar;

  ionViewDidLoad() {
    this.subscriptionService.addSubscription(
      this.lobbyService.findAll().subscribe(
        (lobbies:Lobby[]) => {
          this.lobbies = lobbies;
          this.sortByName(this.lobbies);
          this.filteredLobbies = this.lobbies;
        }
    ));
  }

  public setShowSearchbar(b : boolean) : void {
    this.showSearchbar = b;

    if (this.showSearchbar) {
      setTimeout(() => {this.searchbar.setFocus()}, 300);
    }
  }

  public clearSearchbar() : void {
    this.searchQuery = '';
    this.filteredLobbies = this.lobbies;
  }

  public doSearch() : void {
    this.filteredLobbies = this.lobbies
                          .filter( (lobby) => lobby.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  public joinLobby(lobby : Lobby) : void {
    //TODO - Check ob der Player schon drin ist sollte noch rein.
    //localStorage.setItem("joinedLobby", "yes");
    this.profileService.getCurrentProfile().subscribe(
      (profile: Profile) => {
        if (profile) {
          this.profile = profile;
          if (lobby.players.length <= this.maxPlayerConst && profile.cash > 0){
            document.getElementsByClassName('tabbar')[0].setAttribute("display", "false");
            this.navCtrl.push(LobbyIngamePageComponent, {lobby: lobby});
          }
        }
      }
    ).unsubscribe();
  }

  private sortByName(lobbies : Lobby[]) : void {
    lobbies.sort( (l1,l2) => {
      if (l1.name < l2.name) {
        return -1;
      }
      if (l1.name > l2.name) {
        return 1;
      }
      return 0;
    });
  }

  public createLobby() {
    let modalCreationPage = this.modalCtrl.create(LobbyCreationPageComponent);

    modalCreationPage.onDidDismiss( (lobby:Lobby) => {
      if (lobby) {
        this.lobbyService.create(lobby);
      }
    });


    modalCreationPage.present();
  }

}
