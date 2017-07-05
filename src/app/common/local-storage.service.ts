import {Injectable} from "@angular/core";
import {AuthService} from "../login/AuthService";
import {LocalDataObject} from "./local-data-object.model";
/**
 * Created by Sebastian on 05.07.2017.
 */
@Injectable()
export class LocalStorageService {
  /*
                        Local Storage:

   Key is the email from the current user. (localStorage.getItem("<EMAIL>")).
   The returned value is a string which is a LocalDataObject.
   Remember that every variable is stored as a string.


   */
  errorMsg : string = " in local-storage.service.ts \n User must be logged in to use the Local Storage";

  constructor(private authService : AuthService) {}

  public initializeStorageIfNecessary() {
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) { //user is logged in
      let storedData = localStorage.getItem(currentUser.email);
      if(!storedData) { //first login or new account created
        let newStorageData = new LocalDataObject(false, "ShowOnlyMyCardback", "#488aff");
        this.storeAll(newStorageData);
      } else { //already logged in earlier -> no need to init anything
        //do nothing
      }
    } else {
      console.log("Error @initializeStorage" + this.errorMsg)
    }
  }

  public getAll() : LocalDataObject{
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) {
      let storedData : LocalDataObject = JSON.parse(localStorage.getItem(currentUser.email));
      return storedData;
    } else {
      console.log("Error @getAll" + this.errorMsg)
    }
  }

  public storeAll(localDataObject : LocalDataObject) : void {
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) {
      localStorage.setItem(currentUser.email, JSON.stringify(localDataObject));
    } else {
      console.log("Error @storeAll" + this.errorMsg);
    }
  }

  public setUseCustomOptions(useCustomOptions : boolean) : void {
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) {
      let storedData : LocalDataObject = this.getAll();
      storedData.useCustomOptions = useCustomOptions;
      this.storeAll(storedData);
    } else {
      console.log("Error @setUseCustomOptions" + this.errorMsg);
    }
  }
  public getUseCustomOptions() : boolean {
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) {
      return this.getAll().useCustomOptions;
    } else {
      console.log("Error @getUseCustomOptions" + this.errorMsg);
      return false
    }
  }

  public setCardbackAppearance(cardbackAppearance : string) : void {
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) {
      let storedData : LocalDataObject = this.getAll();
      storedData.cardbackAppearance = cardbackAppearance;
      this.storeAll(storedData);
    } else {
      console.log("Error @setCardbackAppearance" + this.errorMsg);
    }
  }
  public getCardbackAppearance() : string {
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) {
      return this.getAll().cardbackAppearance;
    } else {
      console.log("Error @getCardbackAppearance" + this.errorMsg);
    }
  }

  public setClientColorHexcode(clientColorHexcode : string) : void {
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) {
      let storedData : LocalDataObject = this.getAll();
      storedData.clientColorHexcode = clientColorHexcode;
      this.storeAll(storedData);
    } else {
      console.log("Error @setClientColorHexcode" + this.errorMsg);
    }
  }
  public getClientColorHexcode() : string {
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) {
      return this.getAll().clientColorHexcode;
    } else {
      console.log("Error @getClientColorHexcode" + this.errorMsg);
    }
  }
}
