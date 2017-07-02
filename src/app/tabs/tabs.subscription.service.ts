import {Subscription} from "rxjs/Subscription";
import {Injectable} from "@angular/core";
/**
 * Created by sebb9 on 01.07.2017.
 */
@Injectable()
export class TabsSubscriptionService {

  private subscriptions : Subscription[] = [];

  constructor() {

  }

  public addSubscription(sub : Subscription) : void {
    this.subscriptions.push(sub);
  }

  public removeSubscription(sub : Subscription) : void {
    let index = this.subscriptions.indexOf(sub);

    this.subscriptions.splice(index,1);
  }

  public getSubscriptions() : Subscription[] {
    return this.subscriptions;
  }

  public unsubscribeAll() : void {
    this.subscriptions.forEach( (subscription) => subscription.unsubscribe() );
  }





}
