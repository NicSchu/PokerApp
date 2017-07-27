import {Injectable} from "@angular/core";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {Achievement} from "./achievement.model";
import "rxjs/add/operator/map";

/**
 * Created by sebb9 on 29.06.2017.
 */

@Injectable()
export class AchievementService {

  fbAllAchievements : FirebaseListObservable<any[]>;
  allAchievements : Observable<Achievement[]>;


  constructor(afDb: AngularFireDatabase) {

    this.fbAllAchievements = afDb.list('/achievements');

    this.allAchievements = this.fbAllAchievements.map(
      (fbAllAchievements : any[]): Achievement[] => {
        return fbAllAchievements.map(
          fbAchievement => {
            let achievement = Achievement.createWith(fbAchievement);
            achievement.id = fbAchievement.$key;
            return achievement;
          }
        )
      }
    );
    /*
    this.create(new Achievement("1", "Small loan of a million chips", "Win a pot with 1 million chips",10,false, AchievementCategory.CHIP_BASED, 100000));

    this.create(new Achievement("2", "Beginner", "Play 3 rounds",5,false, AchievementCategory.ROUND_BASED, 1000));
    this.create(new Achievement("3", "Casual player", "Play 20 rounds",5,false, AchievementCategory.ROUND_BASED, 10000));
    this.create(new Achievement("4", "Intermediate Player", "play 50 rounds",5,false, AchievementCategory.ROUND_BASED, 20000));
    this.create(new Achievement("5", "Expert", "Play 150 rounds",5,false, AchievementCategory.ROUND_BASED, 30000));
    this.create(new Achievement("6", "Semi-pro", "Play 250 rounds",5,false, AchievementCategory.ROUND_BASED, 40000));
    this.create(new Achievement("7", "Professional", "Play 500 rounds",5,false, AchievementCategory.ROUND_BASED, 50000));

    this.create(new Achievement("8", "On his way to wealth", "Reach 500k chips",5,false, AchievementCategory.CHIP_BASED, 100000));
    this.create(new Achievement("9", "Newly rich", "Reach 750k chips",10,false, AchievementCategory.CHIP_BASED, 200000));
    this.create(new Achievement("10", "Chipillionaire", "Reach 1 million chips",15,false, AchievementCategory.CHIP_BASED, 300000));

    this.create(new Achievement("11", "Win strike", "Win 2 rounds in a row",5,false, AchievementCategory.WIN_STREAK, 50000));
    this.create(new Achievement("12", "Hattrick", "Win 3 rounds in a row",10,false, AchievementCategory.WIN_STREAK, 10000));
    this.create(new Achievement("13", "Gladstone gander", "Win 5 rounds in a row",20,false, AchievementCategory.WIN_STREAK, 1000000));

    this.create(new Achievement("14", "Newcomer", "Win 3 rounds",5,false, AchievementCategory.AMOUNT_OF_WINS, 5000));
    this.create(new Achievement("15", "Amateur", "Win 20 rounds",10,false, AchievementCategory.AMOUNT_OF_WINS, 10000));
    this.create(new Achievement("16", "Experienced player", "Win 50 rounds",15,false, AchievementCategory.AMOUNT_OF_WINS, 20000));
    this.create(new Achievement("17", "Advanced player", "Win 150 rounds",20,false, AchievementCategory.AMOUNT_OF_WINS, 30000));
    this.create(new Achievement("18", "Masterly player", "Win 250 rounds",30,false, AchievementCategory.AMOUNT_OF_WINS, 40000));
    this.create(new Achievement("19", "Godlike", "Win 500 rounds",50,false, AchievementCategory.AMOUNT_OF_WINS, 50000));

    this.create(new Achievement("20", "Open mind", "Get a straight",5,false, AchievementCategory.HAND_BASED, 10000));
    this.create(new Achievement("21", "Racist", "Get a flush",5,false, AchievementCategory.HAND_BASED, 20000));
    this.create(new Achievement("22", "Gouseparty", "Get a full house",5,false, AchievementCategory.HAND_BASED, 30000));
    this.create(new Achievement("23", "Four times trouble", "Get four of a kind",5,false, AchievementCategory.HAND_BASED, 40000));
    this.create(new Achievement("24", "Racist counting pro", "Get a straight flush",5,false, AchievementCategory.HAND_BASED, 50000));
    this.create(new Achievement("25", "Majestic as fuck", "Get a royal flush",5,false, AchievementCategory.HAND_BASED, 60000));

    this.create(new Achievement("26", "Pokerface", "Win a round with the second best hand",5,false, AchievementCategory.SPECIAL_HAND_BASED, 1000));
    this.create(new Achievement("27", "Stoneface", "Win a round with the third best hand",5,false, AchievementCategory.SPECIAL_HAND_BASED, 2000));
    this.create(new Achievement("28", "Unemotional bastard", "Win a round with the fourth best hand",5,false, AchievementCategory.SPECIAL_HAND_BASED, 3000));
    this.create(new Achievement("29", "Manipulative master", "Win a round with the worst hand",5,false, AchievementCategory.SPECIAL_HAND_BASED, 4000));

    this.create(new Achievement("30", "Goodbye loneliness!", "Add a friend",5,false, AchievementCategory.FRIEND_BASED, 1000));
    this.create(new Achievement("31", "A fist full of love", "Add 5 friends",10,false, AchievementCategory.FRIEND_BASED, 5000));
    this.create(new Achievement("32", "Rich kid", "Add 10 friends",15,false, AchievementCategory.FRIEND_BASED, 10000));
    this.create(new Achievement("33", "Famous kid", "Add 20 friends",20,false, AchievementCategory.FRIEND_BASED, 20000));

    this.create(new Achievement("34", "Designer", "Change the card back",10,false, AchievementCategory.OTHER, 1000));
    */
  }


  public findAll() : Observable<Achievement[]> {
    return this.allAchievements;
  }

  public create(achievement : Achievement) : void {
    this.fbAllAchievements.push(this.copyAndPrepareAchievement(achievement));
  }

  private copyAndPrepareAchievement(achievement : any) : Achievement {
    let newAchievement = Achievement.createWith(achievement);
    newAchievement.id = null;
    newAchievement.name = newAchievement.name || null;
    newAchievement.description = newAchievement.description|| null;
    newAchievement.points= newAchievement.points|| null;
    return newAchievement;
  }

}
