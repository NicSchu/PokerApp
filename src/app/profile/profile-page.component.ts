import {Component} from "@angular/core";
import {Profile} from "./profile.model";
import {NavParams} from "ionic-angular";
import {Login} from "../login/login.model";
import {Achievement} from "../achievements/achievement.model";
/**
 * Created by sebb9 on 08.06.2017.
 */


@Component({
  selector:'profile-page',
  templateUrl: 'profile-page.component.html'
})
export class ProfilePageComponent {

  profile:Profile;

  constructor(public navParams: NavParams) {

    if (navParams.data.id) {
      // TODO - setze das richtige Profil vom Login....
      console.log(navParams.data.id);
    } else {
      //TODO - remove MOCK-Data!!!!
      this.profile = new Profile(new Login('Klaus', 'geheim'), 'Peter', 100000, undefined,
          [new Achievement('ABC', 'MEga gutes Teil', 100, true),
            new Achievement('DEF', 'Viel besser', 10000, false)
          ],
          400);
    }

  }

}
