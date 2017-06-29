import {Component} from "@angular/core";
import {AuthService} from "../login/AuthService";
/**
 * Created by sebb9 on 08.06.2017.
 */


@Component({
  selector: 'settings-page',
  templateUrl: 'settings-page.component.html'
})
export class SettingsPageComponent {


  constructor(private authService : AuthService) {
  }

  public logout(){
    this.authService.logout();
  }

}
