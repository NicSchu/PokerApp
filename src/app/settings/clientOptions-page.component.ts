import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
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

  //Variables related to HTML components through [(ngModel)]
  useCustomOptions : boolean;
  cardbackAppearance : string;
  colorPickerValue : number;

  rangePickerValueToColorName = //Take a look at src/theme/variables.scss
  {
    0 : 'rainbowRedOne',
    1: 'rainbowOrange',
    2: 'rainbowYellowOne',
    3: 'rainbowYellowTwo',
    4: 'rainbowGreenOne',
    5: 'rainbowGreenTwo',
    6: 'rainbowGreenThree',
    7: 'rainbowTurquoiseOne',
    8: 'rainbowTurquoiseTwo',
    9: 'rainbowTurquoiseThree',
    10: 'rainbowBlueOne',
    11: 'rainbowBlueTwo',
    12: 'rainbowBlueThree',
    13: 'rainbowBlueFour',
    14: 'rainbowPurpleOne',
    15: 'rainbowPurpleTwo',
    16: 'rainbowPinkOne',
    17: 'rainbowPinkTwo',
    18: 'rainbowPinkThree',
    19: 'rainbowPinkFour',
    20: 'rainbowRedTwo'
  };

  constructor(private navCtrl : NavController,
              private locStorageService : LocalStorageService,
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
    this.colorPickerValue = this.localStorageService.getColorPickerValue(); //TODO
  }

  public pushCardbackPickerPage() {
    this.navCtrl.push(CardbackPickerComponent);
  }

  public adjustLayoutColor() : void {;
    this.localStorageService.setClientColor(this.rangePickerValueToColorName[this.colorPickerValue]);
    this.localStorageService.setColorPickerValue(this.colorPickerValue);
  }

}
