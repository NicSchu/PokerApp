import {Component, ViewChild} from "@angular/core";
import {LobbyService} from "./lobby.service";
import {Lobby} from "./lobby.model";
import {ModalController, Searchbar} from "ionic-angular";
import {TabsSubscriptionService} from "../tabs/tabs.subscription.service";
import {LobbyCreationPageComponent} from "./lobby-creation-page.component";
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

  private maxPlayerConst : number = 4;

  constructor(private lobbyService : LobbyService,
              private subscriptionService: TabsSubscriptionService,
              private modalCtrl : ModalController) {
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
                          .filter( (lobby) => lobby.name.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase()));
  }

  public joinLobby(lobby : Lobby) : void {
    //TODO - muss noch implementiert werden!
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
      this.lobbyService.create(lobby);
    });

    modalCreationPage.present();
  }

}
