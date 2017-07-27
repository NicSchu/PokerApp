import {Component} from "@angular/core";
import {LocalStorageService} from "../../common/local-storage.service";
import {ProfileService} from "../../profile/profile.service";
import {Profile} from "../../profile/profile.model";
import {ImagePicker} from "@ionic-native/image-picker";

import "firebase/storage";
import * as firebase from "firebase/app";

import {File} from "@ionic-native/file";
import StringFormat = firebase.storage.StringFormat;
import Reference = firebase.storage.Reference;
import {CardbackPickerSerivce} from "./cardbackPicker.service";
import {AuthService} from "../../login/AuthService";
import {LoadingController, AlertController} from "ionic-angular";
import {SubscriptionService} from "../../tabs/subscription.service";

/**
 * Created by Sebastian on 05.07.2017.
 */
@Component({
  selector: 'cardbackPicker-page',
  templateUrl: 'cardbackPicker-page.component.html'
})
export class CardbackPickerComponent {
  private profile:Profile;

  private cardbackRef : Reference;

  private cardbackPath : string = '';


  constructor(private localStorageService : LocalStorageService,  //localStorageService is used in the HTML file (<ion-navbar> tag)
              private imagePicker : ImagePicker,
              private filesystem: File,
              private alertCtrl: AlertController,
              private loadingCtrl : LoadingController,
              private subscriptionService : SubscriptionService,
              private profileService : ProfileService,
              private authService : AuthService,
              private cardbackPickerService : CardbackPickerSerivce) {

    this.subscriptionService.addSubscription(
      this.profileService.getCurrentProfile().subscribe(
        (profile: Profile) => {
          if (profile) {
            this.profile = profile;
          }
        }
      )
    );


    this.cardbackPath = this.cardbackPickerService.getCardbackPath(this.authService.getCurrentUser().email);

    this.cardbackRef = this.cardbackPickerService.getStorageRootReference();
    this.cardbackRef = this.cardbackPickerService.getChildOfReference(this.cardbackRef, this.cardbackPath);
  }

  public uploadCardback() {

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

                      let alert = this.alertCtrl.create({
                        title: 'Cardback uploaded',
                        message: 'Your Cardback was successfully updated.',
                        buttons: ['Dismiss']
                      });

                      alert.present();
                    } else {
                      let alert = this.alertCtrl.create({
                        title: 'Upload failed',
                        message: 'Failed to upload your Cardback. Please check your network connection.',
                        buttons: ['Dismiss']
                      });
                      alert.present();
                    }
                  });
                  loading.present();

                  //Upload File to Firebase
                  this.cardbackRef.putString(dataUrl, StringFormat.DATA_URL)
                    .then((snapshot) => {
                      // Do something here when the data is succesfully uploaded

                      this.cardbackRef.getDownloadURL().then(
                        (newCardback) => {

                          this.profile.cardback = newCardback;

                          this.profileService.update(this.profile);

                          loading.dismiss(true);
                        }
                      );
                    })
                    .catch((error) => {
                      //TODO - ist keine Internet-Connection da, hängt der Spinner ständig(ggf. ändern)
                      loading.dismiss();
                    })
                });
              // x.then(
              //   (a) => {
              //     console.log('a');
              //     console.log(a);
              //   }
              // ).catch(
              //   (error) => {
              //     console.log('error');
              //     console.log(error);
              //   }
              // );

              // console.log(x);

            }
          }

        },
        (error) => {
          console.log(error);
        } );

  }
}
