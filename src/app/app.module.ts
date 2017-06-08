import {ErrorHandler, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";

import {TabsPage} from "./tabs/tabs";

import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {SettingsPageComponent} from "./settings/settings-page.component";
import {ProfilePageComponent} from "./profile/profile-page.component";
import {LobbyPageComponent} from "./lobby/lobby-page.component";
import {FriendsPageComponent} from "./friends/friends-page.component";

@NgModule({
  declarations: [
    MyApp,
    SettingsPageComponent,
    ProfilePageComponent,
    LobbyPageComponent,
    FriendsPageComponent,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SettingsPageComponent,
    ProfilePageComponent,
    LobbyPageComponent,
    FriendsPageComponent,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
