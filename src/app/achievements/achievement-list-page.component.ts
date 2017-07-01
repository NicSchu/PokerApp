import {Component} from "@angular/core";
import {Achievement} from "./achievement.model";
import {NavParams} from "ionic-angular";
/**
 * Created by sebastian on 29.06.17.
 */

@Component({
  selector: 'achievement-list-page',
  templateUrl: 'achievement-list-page.component.html'
})
export class AchievementListPageComponent {

  private allAchievements : Achievement[];
  private filteredAchievements : Achievement[];

  private showSearchbar : boolean = false;

  private searchQuery: string = '';

  //pass all Achievements by Parameter, because Profile-Page already loaded them... (to save Data-Volumne)
  constructor(private navParams : NavParams) {

    if (this.navParams.data) {

      //create new Array, because Object-Reference is passed by parameter
      this.navParams.data.forEach((achievement) => {this.allAchievements.push(achievement)});

      //first sort all
      this.sortByName(this.allAchievements);

      this.filteredAchievements = this.allAchievements;

    } else {
      //should not happen!!! (only call from Profile-Page with all Achievements as parameter)
    }

  }

  public setShowSearchBar(showSearchbar : boolean) : void {
    this.showSearchbar = showSearchbar;
  }

  public doSearch() : void {
    //only Search by name
    this.filteredAchievements = this.allAchievements
                              .filter((achievement) => {
                                achievement.name.toLowerCase().includes(this.searchQuery.toLowerCase())
                              });
    //TODO - maybe create temp array
    this.sortByName(this.filteredAchievements);
  }

  public clearSearchbar() : void {
    this.searchQuery = '';
    this.filteredAchievements = this.allAchievements;
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



}
