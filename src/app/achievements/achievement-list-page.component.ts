import {Component, ViewChild} from "@angular/core";
import {Achievement} from "./achievement.model";
import {NavController, NavParams, Searchbar} from "ionic-angular";
import {AchievementDetailPageComponent} from "./achievement-detail-page.component";
/**
 * Created by sebastian on 29.06.17.
 */

@Component({
  selector: 'achievement-list-page',
  templateUrl: 'achievement-list-page.component.html'
})
export class AchievementListPageComponent {

  @ViewChild(Searchbar)
  private searchbar : Searchbar;

  private allAchievements : Achievement[] = [];
  private filteredAchievements : Achievement[] = [];

  private sumAchievementPoints : number = 0;

  private showSearchbar : boolean = false;

  private searchQuery: string = '';

  //pass all Achievements by Parameter, because Profile-Page already loaded them... (to save Data-Volumne)
  constructor(private navParams : NavParams,
              private navCtrl : NavController) {

    if (this.navParams.data) {

      //create new Array, because Object-Reference is passed by parameter
      this.navParams.data.forEach((achievement) => {this.allAchievements.push(achievement)});

      //first sort all
      this.sortByName(this.allAchievements);

      this.filteredAchievements = this.allAchievements;

      this.calculateSum();

    } else {
      //should not happen!!! (only call from Profile-Page with all Achievements as parameter)
    }

  }

  public setShowSearchBar(showSearchbar : boolean) : void {
    this.showSearchbar = showSearchbar;

    if (this.showSearchbar) {
      setTimeout(() => {this.searchbar.setFocus()}, 300);
    }
  }

  public doSearch() : void {
    //only Search by name
    this.filteredAchievements = this.allAchievements
                              .filter((achievement) =>
                                achievement.name.toLowerCase().includes(this.searchQuery.toLowerCase())
                              );

    this.sortByName(this.filteredAchievements);

    this.calculateSum();
  }

  public clearSearchbar() : void {
    this.searchQuery = '';
    this.filteredAchievements = this.allAchievements;

    this.calculateSum();
  }

  private sortByName(achievements : Achievement[]) {
    achievements.sort( (a1,a2) => {
      if (a1.name < a2.name) {
        return -1;
      }
      if (a1.name > a2.name) {
        return 1;
      }
      return 0;
    });
  }

  private calculateSum() : void {

    let accomplishedAchievements : Achievement[] = this.filteredAchievements.filter((achievement) => achievement.accomplished);

    if (accomplishedAchievements.length > 0) {
      this.sumAchievementPoints =     accomplishedAchievements
                                      .map((achievement) => achievement.points)
                                      .reduce( (a,b) => a + b );
    } else {
      this.sumAchievementPoints = 0;
    }

  }

  public showAchievementDetails(achievement : Achievement) : void {
    this.navCtrl.push(AchievementDetailPageComponent, achievement);
  }



}
