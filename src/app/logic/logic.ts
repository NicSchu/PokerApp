import {PlayingCard} from "./cards.model";
import {HandRating} from "./hand-rating.module";

export class rules{
  toBeRatedHand: PlayingCard[];
  ratedHand: PlayingCard[];
  constructor(hand: PlayingCard[] = new Array[7]){
    this.toBeRatedHand = hand;
    this.ratedHand = null;
  }

  rateHand() {
    this.toBeRatedHand.sort(function(a,b){
      if (a.value > b.value) return 1;
      if (a.value < b.value) return -1;
      return 0;});
    if(this.isStraight()){
      if (this.isSameColor(this.ratedHand)){
        return new HandRating(9, this.ratedHand[0].value);
      }
      return new HandRating(5, this.ratedHand[0].value);
    }

  }

  //returns true if the Array contains 5 cards of the same color
  isSameColor(cards: PlayingCard[]){
    let colors : number[] = [4];
    for (let col of cards) colors[col.color]++
    for (let c of colors) if (c >= 5) return true;
    return false
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
