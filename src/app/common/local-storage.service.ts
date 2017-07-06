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

   Key is the email.toLowerCase() from the current user. (localStorage.getItem("<EMAIL>")).
   The returned value is a string which is a LocalDataObject.
   Remember that every variable is stored as a string.


   */
  errorMsg : string = " in local-storage.service.ts \n User must be logged in to use the Local Storage";
  defaultCardbackAppearance : string = "ShowOnlyMyCardback";
  defaultNavbarColor : string = "rainbowBlueThree";
  defaultColorPickerValue : number = 13;

  constructor(private authService : AuthService) {}

  public initializeStorageIfNecessary() {
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) { //user is logged in
      let storedData = localStorage.getItem(currentUser.email.toLowerCase());
      if(!storedData) { //first login or new account created
        let newStorageData = new LocalDataObject(false, this.defaultCardbackAppearance, this.defaultNavbarColor, this.defaultColorPickerValue);
        this.storeAll(newStorageData);
      } else { //already logged in earlier -> no need to init anything
        //do nothing
      }
    } else {
      console.log("Error @initializeStorage" + this.errorMsg)
    }
  }

  public getAll() : LocalDataObject {
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) {
      let storedData : LocalDataObject = JSON.parse(localStorage.getItem(currentUser.email.toLowerCase()));
      return storedData;
    } else {
      console.log("Error @getAll" + this.errorMsg)
    }
  }

  public storeAll(localDataObject : LocalDataObject) : void {
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) {
      localStorage.setItem(currentUser.email.toLowerCase(), JSON.stringify(localDataObject));
    } else {
      console.log("Error @storeAll" + this.errorMsg);
    }
  }

  //////////////// Only getters and setters below ////////////////

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
      if(this.getUseCustomOptions()) { //Be sure not to skip this "if" when reading this class
        return this.getAll().cardbackAppearance;
      } else {
        return this.defaultCardbackAppearance;
      }
    } else {
      console.log("Error @getCardbackAppearance" + this.errorMsg);
    }
  }

  public setClientColor(clientColor : string) : void {
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) {
      let storedData : LocalDataObject = this.getAll();
      storedData.clientColor = clientColor;
      this.storeAll(storedData);
    } else {
      console.log("Error @setClientColor" + this.errorMsg);
    }
  }
  public getClientColor() : string {
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) {
      if(this.getUseCustomOptions()) { //Be sure not to skip this "if" when reading this class
        return this.getAll().clientColor;
      } else {
        return this.defaultNavbarColor;
      }
    } else {
      //TODO - when you log out, you´ll get here. Try debugging to see it.
    }
  }

  public setColorPickerValue(colorPickerValue : number) : void {
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) {
      let storedData : LocalDataObject = this.getAll();
      storedData.colorPickerValue = colorPickerValue;
      this.storeAll(storedData);
    } else {
      console.log("Error @setColorPickerValue" + this.errorMsg);
    }
  }
  public getColorPickerValue() : number {
    let currentUser = this.authService.getCurrentUser();
    if(currentUser) {
      if(this.getUseCustomOptions()) { //Be sure not to skip this "if" when reading this class
        return this.getAll().colorPickerValue;
      } else {
        return this.defaultColorPickerValue;
      }
    } else {
      console.log("Error @getColorPickerValue" + this.errorMsg);
    }
  }

}
