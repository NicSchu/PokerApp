import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {CardbackPickerComponent} from "./clientOptions_subpages/cardbackPicker-page.component";
import {LocalStorageService} from "../common/local-storage.service";
import {ClientOptionsConstants} from "./clientOptions-page.constants";
import {ProfileService} from "../profile/profile.service";
/**
 * Created by Sebastian on 29.06.2017.
 */
@Component({
  selector: 'clientOptions-page',
  templateUrl: 'clientOptions-page.component.html'
})
export class ClientOptionsPageComponent {

  //Variables related to HTML components through [(ngModel)]
  useCustomOptions : boolean;
  cardbackAppearance : string;
  colorPickerValue : number;

  constructor(private navCtrl : NavController,
              private locStorageService : LocalStorageService,
              private profileService : ProfileService,
              private localStorageService : LocalStorageService) { //localStorageService is used in the HTML file (<ion-navbar> tag)
    this.useCustomOptions = locStorageService.getUseCustomOptions();
    this.cardbackAppearance = locStorageService.getCardbackAppearance();
    this.colorPickerValue = locStorageService.getColorPickerValue();
  }

  ionViewWillLeave() {
    this.locStorageService.setCardbackAppearance(this.cardbackAppearance);
  }

  public toggleUseCustomOptions() : void {
    this.useCustomOptions = !this.useCustomOptions;
    this.localStorageService.setUseCustomOptions(this.useCustomOptions);
    this.colorPickerValue = this.localStorageService.getColorPickerValue();

    this.profileService.getCurrentProfile().subscribe(
      (profile) => {
        profile.usingDefaultCardback = !this.useCustomOptions;
        this.profileService.update(profile);
      }
    ).unsubscribe()
  }

  public pushCardbackPickerPage() {
    this.navCtrl.push(CardbackPickerComponent);
  }

  public adjustLayoutColor() : void {
    this.localStorageService.setClientColor(ClientOptionsConstants.colorNames[this.colorPickerValue]);
    this.localStorageService.setColorPickerValue(this.colorPickerValue);
  }

}
