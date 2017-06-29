import {ErrorHandler, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";

import {TabsPage} from "./tabs/tabs";

import {AngularFireDatabase, AngularFireDatabaseModule} from "angularfire2/database";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {SettingsPageComponent} from "./settings/settings-page.component";
import {ProfilePageComponent} from "./profile/profile-page.component";
import {LobbyPageComponent} from "./lobby/lobby-page.component";
import {FriendsPageComponent} from "./friends/friends-page.component";
import {LoginPageComponent} from "./login/login-page.component";
import {AngularFireModule} from "angularfire2";
import {AngularFireAuth} from "angularfire2/auth";
import {AuthService} from "./login/AuthService";
import {RegistryPageComponent} from "./login/registry-page.component";
import {ImagePicker} from "@ionic-native/image-picker";
import {PhotoLibrary} from "@ionic-native/photo-library";
import {File} from "@ionic-native/file";
import {AchievementService} from "./achievements/achievement.service";
import {ProfileService} from "./profile/profile.service";
import {ImpressumPageComponent} from "./settings/impressum-page.component";
import {ClientOptionsPageComponent} from "./settings/clientOptions-page.component";
import {CardbacksPageComponent} from "./settings/cardbacks-page.component";

export const firebaseConfig = {
  apiKey: "AIzaSyCi2KvgtcoIz_DqETuUE3d9G8-_GCNunmw",
  authDomain: "poker-b817e.firebaseapp.com",
  databaseURL: "https://poker-b817e.firebaseio.com/",
  projectId: "poker-b817e",
  storageBucket: "poker-b817e.appspot.com",
  messagingSenderId: "916592085687"
};

@NgModule({
  declarations: [
    MyApp,
    SettingsPageComponent,
    LoginPageComponent,
    ProfilePageComponent,
    LobbyPageComponent,
    FriendsPageComponent,
    TabsPage,
    RegistryPageComponent,
    ImpressumPageComponent,
    ClientOptionsPageComponent,
    CardbacksPageComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPageComponent,
    SettingsPageComponent,
    ProfilePageComponent,
    LobbyPageComponent,
    FriendsPageComponent,
    TabsPage,
    RegistryPageComponent,
    ImpressumPageComponent,
    ClientOptionsPageComponent,
    CardbacksPageComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireDatabase,
    AngularFireAuth,
    AuthService,
    ImagePicker,
    PhotoLibrary,
    ProfileService,
    AchievementService,
    File
  ]
})
export class AppModule {}
