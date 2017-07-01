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
}
