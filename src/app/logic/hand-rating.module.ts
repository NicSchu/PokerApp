export class HandRating{
  //* z.B. 10 -> Royal Flush,
  // 9 -> Flush
  hand: number;

  /* z.B. KKK-33 ->
   hand = 8
   value = 13
  */
  value: number;

  /* z.B. KKK-33 ->
      nextHand =
        hand = 8
        value = 3
  * */
  nextHand: HandRating;

  constructor(hand :number, value: number){
    this.hand = hand;
    this.value = value;
    this.nextHand = null;
  }

  next(next: HandRating){
    this.nextHand = next
  }

  /*handA.compare(handB)
  * returns 1 if handA is stronger
  * returns -1 if handB is stronger
  * returns 0 if booth hands are equal
  * */
  compare(compHand: HandRating):number {
    if (compHand.hand > this.hand) return -1;
    if (compHand.hand < this.hand) return 1;
    if (compHand.value > this.value) return -1;
    if (compHand.value < this.value) return 1;
    if (this.nextHand) return this.nextHand.compare(compHand.nextHand);
    return 0;
  }
}
