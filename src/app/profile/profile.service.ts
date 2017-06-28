import {Injectable} from "@angular/core";
import {AuthService} from "../login/AuthService";
import {FirebaseObjectObservable} from "angularfire2/database";
/**
 * Created by sebb9 on 28.06.2017.
 */

@Injectable()
export class ProfileService {

  profile : FirebaseObjectObservable<any>;


  constructor(private authService : AuthService) {

    // 'user/' + authService.getCurrentUser().uid
  }

  public createProfile() {

  }

}
