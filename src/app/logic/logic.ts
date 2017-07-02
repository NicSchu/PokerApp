import {PlayingCard} from "./cards.model";
import {HandRating} from "./hand-rating.module";

export class rules{
  toBeRatedHand: PlayingCard[];
  ratedHand: PlayingCard[];
  constructor(hand: PlayingCard[] = new Array[7]){
    this.toBeRatedHand = hand;
    this.ratedHand = null;
  }


  //*
  // Give back a HandRating Object which contains a Number for the kind of hand,
  // a Value of the highest Card in this hand and a rekursive structure of other hands
  // (or second half of hand -> full house), if the main hand does not contain 5 cards.
  // The numbers are:
  // 9 - Straight Flush (Royal Flush included -> highes cards ass)
  // 8 - Four of a kind
  // 7 - Full house
  // 6 - Flush
  // 5 - Straight
  // 4 - Three of a kind
  // 3 - Two Pair
  // 2 - Pair
  // 1 - High Card
  // */
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
    if (this.isSameColor(this.toBeRatedHand)){
      //TODO finde die höchsten gleichfarbigen Karten und gib sie zurück in einem HandRating
    }
    return this.countEquals();
  }

  /*
  * this method handles all other combinations of hands and returns the fitting HandRating object with help of highCards()
  * */
  countEquals() {
    let doubles: number[] = [[2] [2] [2]];
    let keys = 0;
    let hand;
    //counts the number of doubled cards in a row in the sorted array and counts the number of mutiple apearing cards
    for (let i = 0; i < this.toBeRatedHand.length - 1; i++) {
      if (this.toBeRatedHand[i].value == this.toBeRatedHand[i + 1].value) {
        doubles[keys][0] = this.toBeRatedHand[i].value;
        doubles[keys][1]++;
      } else keys++;
    }

    //if the key value is 0, there aren't any doubles -> it's a hand containing of high cards
    if (keys == 0) {
      let l = [];
      l.push(this.toBeRatedHand[6].value);
      hand = new HandRating(1, this.toBeRatedHand[6].value);
      this.highCards(4,l,hand);
      return hand;
    }

    //if the key value is 1, there are 3 possibilities: four of a kind, three of a kind, pair
    if (keys == 1){
      let result = 0;
      switch (doubles[0][1]){
        case 3 : result = 8;
          break;
        case 2 : result = 4;
          break;
        case 1 : result = 2;
          break;
      }
      hand = new HandRating(result, doubles[0][0]);
      this.highCards(4-doubles[0][1],doubles[0][0],hand);
      return hand;
    }

    //lets check the highes mutliple appearing card
    let maxmult = 0;
    let maxvalue = 0;

    for (let i = 0; i < keys; i++){
      if (doubles[i][1] > maxmult){
        maxmult = doubles[i][1];
        maxvalue = doubles[i][0];
      } else {
        if (doubles[i][1] == maxmult && doubles[i][0] > maxvalue){
          maxvalue = doubles[i][0];
        }

      }
    }

    //if maxmult value is 3, there is four of a kind, with a pair or additional three of a kind -> four of a kind
    if (maxmult == 3){
      hand =  new HandRating(8,maxvalue);
      let l = [];
      l.push(maxvalue);
      this.highCards(1,l,hand);
      return hand;
    }

    //lets check the second highes mutliple appearing card. The 3. does't change anything
    let maxmult2 = 0;
    let maxvalue2 = 0;
    for (let i = 0; i < keys; i++){
      if (doubles[i][1] != maxmult) {
        if (doubles[i][1] > maxmult2) {
          maxmult2 = doubles[i][1];
          maxvalue2 = doubles[i][0];
        } else {
          if (doubles[i][1] == maxmult && doubles[i][0] > maxvalue) {
            maxvalue2 = doubles[i][0];
          }

        }
      }
    }
    //the last 2 options with 2 muliple appearing card values
    switch(maxmult){
      //Fullhouse
      case 2 : hand = new HandRating(7, maxvalue);
               hand.nextHand = new HandRating(7, maxvalue2);
               break;
               //Two Pairs
      case 1 : hand = new HandRating(3, maxvalue);
               hand.nextHand = new HandRating(3, maxvalue2);
               let l = [];
               l.push(maxvalue);
               l.push(maxvalue2);
               this.highCards(1,l,hand);
               break;
    }
  }

  /*
  * numcards - number of highcards missing for complete hand
  * forbiddenValue - hashmap of card-values, that are already used in doubles, tripples, quads and can't be highCards anymore
  * hand - HandRating object to complete
  *
  * completes the hand - object with number of missing high cards to complete HandRating object to 5 cards
  * */
  highCards(numcards: number, forbiddenValue: number[], hand: HandRating){
    let next = hand;
    while (hand.nextHand != null) next = next.nextHand;
    for (let i = this.toBeRatedHand.length-1; numcards > 0; i--){
      if (!(this.toBeRatedHand[i].value in forbiddenValue)){
        next.nextHand = new HandRating(1,this.toBeRatedHand[i].value);
        next = next.nextHand;
      }
    }
  }

  //returns true if the Array contains 5 or more cards of the same color
  isSameColor(cards: PlayingCard[]){
    let colors = [0,0,0,0];
    for (let i = 0; i < cards.length; i++) colors[cards[i].color]++
    for (let i = 0; i < colors.length; i++) if (colors[i] >= 5) return true;

    //for (let col of cards) colors[col.color]++
    //for (let c of colors) if (c >= 5) return true;
    return false
  }

//checks if there is a straight of at least 5 cards in the selection of 7 PlayingCards
  isStraight() {
    console.log(this.toBeRatedHand);
    let straightCounter = 0;
    let doubled = 0;
    for (let i: number = this.toBeRatedHand.length-1; i > 0; i--){
      if ( this.toBeRatedHand[i].value == this.toBeRatedHand[i-1].value ){
        this.ratedHand[straightCounter+doubled] = this.toBeRatedHand[i];
        doubled ++;
        continue;
      }
      if ((this.toBeRatedHand[i].value - this.toBeRatedHand[i-1].value) == 1){
        this.ratedHand[straightCounter+doubled] = this.toBeRatedHand[i];
        straightCounter++;
        if (straightCounter == 4){
          this.ratedHand[straightCounter+doubled] = this.toBeRatedHand[i-1];
          straightCounter++;
          break;
        }
      } else {
        straightCounter = 0;
      }
    }
    //if there are 4 Cards in a row, it musst be checked, if there is an ace in the selection and the row starts with 2
    //this leads to the Straight -> A2345
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
