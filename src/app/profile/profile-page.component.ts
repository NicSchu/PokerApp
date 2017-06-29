import {Component} from "@angular/core";
import {Profile} from "./profile.model";
import {AlertController, LoadingController, NavParams} from "ionic-angular";
import {Achievement} from "../achievements/achievement.model";

import {AuthService} from "../login/AuthService";
import {ImagePicker} from "@ionic-native/image-picker";
import {FirebaseApp} from "angularfire2";

import "firebase/storage";
import * as firebase from "firebase/app";
import {File} from "@ionic-native/file";
import Reference = firebase.storage.Reference;
import StringFormat = firebase.storage.StringFormat;
import Storage = firebase.storage.Storage;
/**
 * Created by sebb9 on 08.06.2017.
 */

@Component({
  selector:'profile-page',
  templateUrl: 'profile-page.component.html'
})
export class ProfilePageComponent {

  profile:Profile;

  profilePictureRef : Reference;

  firebaseStorage : Storage;

  profilePictureURL : string = '';

  test : string = '';

  constructor(public navParams: NavParams,
              private authService : AuthService,
              private imagePicker : ImagePicker,
              private firebase : FirebaseApp,
              private filesystem: File,
              private loadingCtrl : LoadingController,
              private alertCtrl: AlertController) {

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
    //TODO - default Profile-Picture (maybe set test-Variable to other Path)
    this.firebaseStorage = this.firebase.storage();

    this.profilePictureRef = this.firebaseStorage.ref();


    this.test = 'users/' + this.authService.getCurrentUser().uid + '/profilePic/';

    //set Profile-Picture
    this.refreshProfilePictureURL();
  }

  private refreshProfilePictureURL() : void {

    this.firebaseStorage.ref().child(this.test).getDownloadURL()
      .then((url: string) => {
        this.profilePictureURL = url;
      }, (error) => {
        console.log(error);
        this.profilePictureURL = '';
    });

  }

  public uploadPicture() {

    this.imagePicker.getPictures({maximumImagesCount:1})
      .then(
        (results) => {
          if (results !== 'OK') {
            for (let i = 0; i < results.length; i++) {

              let splittedPath = results[i].split("/");

              let filePath  = '';
              //ignore Filename (splittedPath.length- 1)
              for (let i = 0; i < splittedPath.length- 1; i++) {
                filePath += splittedPath[i] + '/';
              }

              //Read selected File from Filesystem, because we only get the absolute-path
              this.filesystem.readAsDataURL(filePath, splittedPath[splittedPath.length -1])
                .then((dataUrl) => {

                  //show Loading-Screen
                  let loading = this.loadingCtrl.create({
                    content: 'Please Wait',
                    spinner: 'crescent',
                  });
                  loading.onDidDismiss( (succeeded : boolean) => {
                    if (succeeded) {
                      //refresh ProfilePicture
                      this.refreshProfilePictureURL();

                      let alert = this.alertCtrl.create({
                         title: 'Picture uploaded',
                         message: 'Your Profile Picture was successfully updated.',
                         buttons: ['Dismiss']
                       });

                       alert.present();
                    } else {
                      let alert = this.alertCtrl.create({
                        title: 'Upload failed',
                        message: 'Failed to upload your Profile Picture. Please check your network connection.',
                        buttons: ['Dismiss']
                      });
                      alert.present();
                    }
                  });
                  loading.present();

                  //Upload File to Firebase
                  this.profilePictureRef.child('users/' + this.authService.getCurrentUser().uid + '/profilePic/').putString(dataUrl, StringFormat.DATA_URL )
                    .then((snapshot) => {
                      // Do something here when the data is succesfully uploaded

                      //
                      loading.dismiss(true);
                    })
                  .catch((error) => {
                    //TODO - ist keine Internet-Connection da, hängt der Spinner ständig(ggf. ändern)
                    loading.dismiss();
                  })
                })
            }
          }

        },
        (error) => {
            console.log(error);
        } );

  }



}



