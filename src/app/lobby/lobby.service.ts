/**
 * Created by sebb9 on 01.07.2017.
 */
import {Injectable} from "@angular/core";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {Lobby} from "./lobby.model";
import "rxjs/add/operator/map";

@Injectable()
export class LobbyService {

  private fbLobbies: FirebaseListObservable<any[]>;
  private lobbyies: Observable<Lobby[]>;

  constructor(private afDb: AngularFireDatabase) {

    this.fbLobbies = afDb.list('/lobbies');

    this.lobbyies = this.fbLobbies.map(
      (fbLobbies: any[]) : Lobby[] => {
        return fbLobbies.map(
          (fbItem => {
            let lobby = Lobby.createWith(fbItem);
            lobby.id  = fbItem.$key;
            return lobby;
          })
        )
      }
    );
  }

  public getObservableLobbies() {
    return this.lobbyies;
  }

  public getLobbyObservableById(lobby: Lobby){
    let localLobbies: Lobby[] = [];
    this.lobbyies.subscribe((lobbies: Lobby[]) => {
      localLobbies = lobbies;
    }).unsubscribe();
    return localLobbies.filter((localLobby) => localLobby.id == lobby.id)
  }

  public findAll() : Observable<Lobby[]> {
    return this.lobbyies;
  }

  public create(lobby : Lobby) : void {
    this.fbLobbies.push(this.copyAndPrepareLobby(lobby))
  }

  public delete(id : string) : void {
    this.fbLobbies.remove(id);
  }

  public update(lobby : Lobby) : void {
    this.fbLobbies.update(lobby.id, this.copyAndPrepareLobby(lobby));
  }


  private copyAndPrepareLobby(lobby: any) : Lobby {
    let newLobby = Lobby.createWith(lobby);
    newLobby.name = newLobby.name || null;
    newLobby.deck = newLobby.deck || null;
    newLobby.status = newLobby.status || null;
    newLobby.players = newLobby.players || null;
    newLobby.id = null;

    return newLobby;

  }
}
