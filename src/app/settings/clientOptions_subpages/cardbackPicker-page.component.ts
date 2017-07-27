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
import {LoadingController, AlertController, ToastController} from "ionic-angular";
import {SubscriptionService} from "../../tabs/subscription.service";
import {AchievementService} from "../../achievements/achievement.service";
import {Achievement} from "../../achievements/achievement.model";
/**
 * Created by Sebastian on 05.07.2017.
 */
@Component({
  selector: 'cardbackPicker-page',
  templateUrl: 'cardbackPicker-page.component.html',
  providers: [AchievementService]
})
export class CardbackPickerComponent {
  private profile:Profile;

  private cardbackRef : Reference;

  private cardbackPath : string = '';

  private achievements : Achievement[];


  constructor(private localStorageService : LocalStorageService,  //localStorageService is used in the HTML file (<ion-navbar> tag)
              private imagePicker : ImagePicker,
              private filesystem: File,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private achievementService : AchievementService,
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

  ionViewDidLoad() {
    this.subscriptionService.addSubscription(
      this.achievementService.findAll().subscribe(
        (achievemenets: Achievement[]) => {
          if (achievemenets) {
            this.achievements = achievemenets;
          }
        }
      )
    );
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

            }
          }

        },
        (error) => {
          console.log(error);
        } );

  }

  public selectPresetCardback(downloadUrl: string) : void {
    this.profile.cardback = downloadUrl;
    this.profileService.update(this.profile);

    let changeCardbackAchievementId = "-KoJEnNa0Czeg2G7rEZj";
    let savedAchievements = this.achievements; //observable could change value during for loop
    for(let i = 0; i < savedAchievements.length; i++) {
      if(savedAchievements[i].id == changeCardbackAchievementId) {
        if(this.profile.accAchievements.filter(a => a == savedAchievements[i].id).length == 0) {
          this.profile.accAchievements.push(savedAchievements[i].id);
          this.profileService.update(this.profile);
        }
      }
    }

    let toast = this.toastCtrl.create({
      message: 'Successfully changed Cardback',
      duration: 2000,
      position: 'bottom'
    });

    toast.present();
  }
}
