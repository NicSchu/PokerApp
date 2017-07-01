/**
 * Created by sebb9 on 01.07.2017.
 */
import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {Achievement} from "./achievement.model";
@Component({
  selector : 'achievement-detail-page',
  templateUrl: 'achievement-detail-page.component.html'
})
export class AchievementDetailPageComponent {

  private achievement : Achievement;

  private pageTitle : string = '';

  constructor(private navParams : NavParams) {


    if (this.navParams.data) {
      this.achievement = this.navParams.data;
      this.pageTitle = this.achievement.name;

    }
  }


}
