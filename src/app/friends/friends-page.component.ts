import {Component} from "@angular/core";
/**
 * Created by sebb9 on 08.06.2017.
 */


@Component({
  selector: 'friends-page',
  templateUrl : 'friends-page.component.html'
})
export class FriendsPageComponent {


  constructor() {

    //TODO - npm install -g firebase-tools

  }

  public showAddFriend() : void {
    //TODO - evtl modal machen, damit im onDidMiss die Friendlist aktualisiert wird
  }
}
