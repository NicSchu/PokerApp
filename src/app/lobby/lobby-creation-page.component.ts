import {Component} from "@angular/core";
import {Lobby} from "./lobby.model";
import {AlertController, ViewController} from "ionic-angular";
/**
 * Created by sebb9 on 02.07.2017.
 */
@Component({
  selector: 'lobby-creation-page',
  templateUrl: 'lobby-creation-page.component.html'
})
export class LobbyCreationPageComponent {

  private lobby : Lobby;

  constructor(private viewCtrl : ViewController,
              private alterCtrl : AlertController) {
    this.lobby = new Lobby();
    //TODO - ermöglichen, dass man die Seite auch wieder verlassen kann....
  }


  public dismissView() : void {
    if (!this.lobby.name) {
      let alert = this.alterCtrl.create({
        title: 'Please insert Lobby-Name',
        buttons: ['OK']
      });
      alert.present();

    } else {
      this.viewCtrl.dismiss(this.lobby);
    }
  }


}
