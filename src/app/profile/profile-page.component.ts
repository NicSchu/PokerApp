import {Component} from "@angular/core";
import {Profile} from "./profile.model";
import {NavParams} from "ionic-angular";
import {Achievement} from "../achievements/achievement.model";
import {AngularFireDatabase} from "angularfire2/database";

import {AuthService} from "../login/AuthService";
import {ImagePicker} from "@ionic-native/image-picker";
/**
 * Created by sebb9 on 08.06.2017.
 */


@Component({
  selector:'profile-page',
  templateUrl: 'profile-page.component.html'
})
export class ProfilePageComponent {

  profile:Profile;

  profilePictureRef : any;

  constructor(public navParams: NavParams,
              private afDb : AngularFireDatabase,
              private authService : AuthService,
              private imagePicker : ImagePicker) {

    console.log("Sinep");

    if (navParams.data.id) {
      // TODO - setze das richtige Profil vom Login....
      console.log(navParams.data.id);
    } else {
      //TODO - remove MOCK-Data!!!!
      this.profile = new Profile('Test', 'Peter', 100000, undefined,
          [new Achievement('ABC', 'MEga gutes Teil', 100, true),
            new Achievement('DEF', 'Viel besser', 10000, false)
          ],
          400);
    }

    // this.profilePictureRef = this.afDb.database.ref('users/' + this.authService.getCurrentUser().uid + '/photo');
    this.profilePictureRef = this.afDb.database.ref('users/' + this.authService.getCurrentUser().uid + '/photo');

  }

  public uploadPicture() {

    this.imagePicker.getPictures({maximumImagesCount:1})
      .then(
        (results) => {
          if (results !== 'OK') {
            for (let i = 0; i < results.length; i++) {
              console.log('Penis' + results[i]);
              this.profilePictureRef.push({id:"image/jpeg" + results[i].getAsFile()})
            }
          }

        },
        (error) => {
            console.log(error);
        } );

    // this.profilePictureRef.push()
  }



}
