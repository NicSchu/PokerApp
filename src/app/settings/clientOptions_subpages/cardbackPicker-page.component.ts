import {Component} from "@angular/core";
import {LocalStorageService} from "../../common/local-storage.service";
/**
 * Created by Sebastian on 05.07.2017.
 */
@Component({
  selector: 'cardbackPicker-page',
  templateUrl: 'cardbackPicker-page.component.html'
})
export class CardbackPickerComponent {
  constructor(private localStorageService : LocalStorageService) { //localStorageService is used in the HTML file (<ion-navbar> tag)

  }
}
