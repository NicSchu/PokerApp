import {Component} from "@angular/core";
import {LocalStorageService} from "../common/local-storage.service";
/**
 * Created by Sebastian on 29.06.2017.
 */
@Component({
  selector: 'impressum-page',
  templateUrl: 'impressum-page.component.html'
})
export class ImpressumPageComponent {


  constructor(private localStorageService : LocalStorageService) { //localStorageService is used in the HTML file (<ion-navbar> tag)
  }


}
