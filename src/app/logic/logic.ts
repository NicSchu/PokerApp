import {PlayingCard} from "./cards.model";
import {HandRating} from "./hand-rating.module";

export class Logic{
  toBeRatedHand: PlayingCard[];
  ratedHand: PlayingCard[];

  constructor(/*hand: PlayingCard[]*/){
    this.ratedHand = [new PlayingCard];
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
  rateHand(tableCards: PlayingCard[], handcards:PlayingCard[]):HandRating {
    this.toBeRatedHand = tableCards.concat(handcards);

    let hand : HandRating = null;
    this.toBeRatedHand.sort(function(a, b){return a.value-b.value});
    if(this.isStraight()){
      if (this.isSameColor(this.ratedHand) >= 0){
        return new HandRating(9, this.ratedHand[0].value);
      }
      return new HandRating(5, this.ratedHand[0].value);
    }
    let color = this.isSameColor(this.toBeRatedHand);
    if (color >= 0){
      let next;
      for (let i = this.toBeRatedHand.length-1; i >= 0; i--){
        if (this.toBeRatedHand[i].color == color){
          if (hand == null){
            next = new HandRating(6,this.toBeRatedHand[i].value);
            hand = next;
          }else{
            next.nextHand = new HandRating(6,this.toBeRatedHand[i].value);
            next = next.nextHand;
          }
        }
      }
      return hand;
    }
    return this.countEquals();
  }

  /*
   * this method handles all other combinations of hands and returns the fitting HandRating object with help of highCards()
   * */
  countEquals() {
    let doubles = [[0,0],[0,0],[0,0]];

    let keys = 0;
    let hand = null;
    let flag = 0;
    //counts the number of doubled cards in a row in the sorted array and counts the number of mutiple apearing cards
    for (let i = 0; i < this.toBeRatedHand.length - 1; i++) {
      if (this.toBeRatedHand[i].value != this.toBeRatedHand[i + 1].value && flag == 1){
        keys++;
        flag = 0;
      }
      if (this.toBeRatedHand[i].value == this.toBeRatedHand[i + 1].value) {
        doubles[keys][0] = this.toBeRatedHand[i].value;
        doubles[keys][1]++;
        flag = 1;
        if (i+2 == this.toBeRatedHand.length) keys++;
      }
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
      this.highCards(4-doubles[0][1],[doubles[0][0]],hand);
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
      if (doubles[i][0] != maxvalue) {
        if (doubles[i][1] > maxmult2) {
          maxmult2 = doubles[i][1];
          maxvalue2 = doubles[i][0];
        } else {
          if (doubles[i][1] == maxmult && doubles[i][0] > maxvalue2) {
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
    return hand;
  }

  /*
   * numcards - number of highcards missing for complete hand
   * forbiddenValue - hashmap of card-values, that are already used in doubles, tripples, quads and can't be highCards anymore
   * hand - HandRating object to complete
   *
   * completes the hand - object with number of missing high cards to complete HandRating object to 5 cards
   * */
  highCards(numcards: number, forbiddenValue: number[], hand: HandRating){
    debugger;
    let next = hand;
    while (next.nextHand != null) next = next.nextHand;
    for (let i = this.toBeRatedHand.length-1; numcards > 0; i--){
      if (forbiddenValue.indexOf(this.toBeRatedHand[i].value) < 0){
        next.nextHand = new HandRating(1,this.toBeRatedHand[i].value);
        next = next.nextHand;
        numcards--;
      }
    }
  }

  //returns the value of the color if the Array contains 5 or more cards of the same color or -1
  isSameColor(cards: PlayingCard[]){
    let colors = [0,0,0,0];
    for (let i = 0; i < cards.length; i++) colors[cards[i].color]++
    for (let i = 0; i < colors.length; i++) if (colors[i] >= 5) return i;
    return -1
  }

  //checks if there is a straight of at least 5 cards in the selection of 7 PlayingCards
  isStraight() {
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
    if (straightCounter == 3){
      if (this.ratedHand[this.ratedHand.length-1].value == 2) {
        if (this.toBeRatedHand[6].value == 14) {
          this.ratedHand[straightCounter+doubled] = new PlayingCard(1, this.toBeRatedHand[6].color);
          straightCounter += 2;
        }
      }
    }
    return (straightCounter == 5)
  }
}
