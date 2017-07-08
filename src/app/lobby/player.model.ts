/**
 * Created by sebb9 on 01.07.2017.
 */
import {LogicPageComponent} from "../logic/logicService";
import {PlayingCard} from "../logic/cards.model";
import {Profile} from "../profile/profile.model";
import {NavParams} from "ionic-angular";
import {ProfileService} from "../profile/profile.service";
import {Observable} from "rxjs/Observable";

export class Player {

  public hand: PlayingCard[];
  public cash: number;
  public id: number;
  public profile: Observable<Profile>;
  constructor(private logicMoudule: LogicPageComponent,
              private profileService: ProfileService) {
    this.profile = this.profileService.profile;
  }

}
