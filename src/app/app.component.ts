import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";

import {LoginPageComponent} from "./login/login-page.component";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //TODO - hier evtl die Abfrage auf den User einbauen, sodass man sofort eingeloggt wird... (Könnte aber Probleme beim Logout geben, da die Root-Page dann nicht mehr Login ist)

  rootPage:any = LoginPageComponent;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
