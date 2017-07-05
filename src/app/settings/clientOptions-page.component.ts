import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {ColorPickerComponent} from "./clientOptions_subpages/colorPicker-page.component";
import {CardbackPickerComponent} from "./clientOptions_subpages/cardbackPicker-page.component";
import {LocalStorageService} from "../common/local-storage.service";
/**
 * Created by Sebastian on 29.06.2017.
 */
@Component({
  selector: 'clientOptions-page',
  templateUrl: 'clientOptions-page.component.html'
})
export class ClientOptionsPageComponent {

  useCustomOptions : boolean;
  cardbackAppearance : string;

  constructor(private navCtrl : NavController,
              private locStorageService : LocalStorageService) {
    this.useCustomOptions = locStorageService.getUseCustomOptions();
    this.cardbackAppearance = locStorageService.getCardbackAppearance();
  }

  ionViewWillLeave() {
    this.locStorageService.setUseCustomOptions(this.useCustomOptions);
    this.locStorageService.setCardbackAppearance(this.cardbackAppearance);
  }

  public pushCardbackPickerPage() {
    this.navCtrl.push(CardbackPickerComponent);
  }

  public pushColorPickerPage() {
    this.navCtrl.push(ColorPickerComponent);
  }

}
