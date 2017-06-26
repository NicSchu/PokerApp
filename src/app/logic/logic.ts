import {PlayingCard} from "./cards.model";

export class rules{
  toBeRatedHand: PlayingCard[];
  ratedHand: PlayingCard[];
  constructor(hand: PlayingCard[] = new Array[7]){
    this.toBeRatedHand = hand
    this.ratedHand = null;
  }

  rateHand() {
    this.toBeRatedHand.sort(function(a,b){
      if (a.value > b.value) return 1;
      if (a.value < b.value) return -1;
      return 0;})
    if(this.isStraight()){

    }

  }

  isStraight() {
    let straightCounter: number = 0;
    for (let i: number = this.toBeRatedHand.length-1; i > 0; i--){
      if ((this.toBeRatedHand[i].value - this.toBeRatedHand[i-1].value) == 1){
        this.ratedHand[straightCounter] = this.toBeRatedHand[i];
        straightCounter++;
        if (straightCounter == 5){
          break;
        }
      }
      else {
        straightCounter = 0;
      }
    }
    if (straightCounter == 4){
      if (this.ratedHand[3].value == 2) {
        if (this.toBeRatedHand[6].value == 14) {
          this.ratedHand[straightCounter] = new PlayingCard(1, this.toBeRatedHand[straightCounter].color);
          straightCounter++;
        }
      }
    }
    return (straightCounter == 5)
  }
}
