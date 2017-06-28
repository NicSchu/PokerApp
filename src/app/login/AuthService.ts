import {Injectable} from "@angular/core";
import {AngularFireAuth} from "angularfire2/auth";

/**
 * Created by Sebastian on 26.06.2017.
 */
@Injectable()
export class AuthService{
  constructor(private firebaseAuth: AngularFireAuth){
  }

  public signIn(email : string, password : string){
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public createAccount(email : string, password : string) {
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  public logout(){
    return this.firebaseAuth.auth.signOut();
  }

  public getCurrentUser()  {
    return this.firebaseAuth.auth.currentUser;
  }

  //TODO - evtl Methode einbauen, die überprüft ob man schon eingeloggt ist, damit könnte man den User
  //direkt beim Starten der Anwendung einloggen, wenn er schon mal eingeloggt war
}
