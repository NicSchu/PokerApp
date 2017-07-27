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
import {LobbyListPageComponent} from "./lobby/lobby-list-page.component";
import {FriendsPageComponent} from "./friends/friends-page.component";
import {LoginPageComponent} from "./login/login-page.component";
import {AngularFireModule} from "angularfire2";
import {AngularFireAuth} from "angularfire2/auth";
import {AuthService} from "./login/AuthService";
import {RegistryPageComponent} from "./login/registry-page.component";
import {ImagePicker} from "@ionic-native/image-picker";
import {File} from "@ionic-native/file";
import {AchievementService} from "./achievements/achievement.service";
import {ProfileService} from "./profile/profile.service";
import {ImpressumPageComponent} from "./settings/impressum-page.component";
import {ClientOptionsPageComponent} from "./settings/clientOptions-page.component";
import {AchievementListPageComponent} from "./achievements/achievement-list-page.component";
import {AchievementDetailPageComponent} from "./achievements/achievement-detail-page.component";
import {SubscriptionService} from "./tabs/subscription.service";
import {LobbyService} from "./lobby/lobby.service";
import {LobbyCreationPageComponent} from "./lobby/lobby-creation-page.component";
import {LocalStorageService} from "./common/local-storage.service";
import {CardbackPickerComponent} from "./settings/clientOptions_subpages/cardbackPicker-page.component";
import {FriendsService} from "./friends/friends.service";
import {FriendsAddPageComponent} from "./friends/friends-add-page.component";
import {LobbyIngamePageComponent} from "./lobby/lobby-ingame-page.component";
import {GameService} from "./lobby/game.service";
import {PlayerService} from "./lobby/player.service";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {LobbyWaitingPageComponent} from "./lobby/lobby-waiting-page.component";
import {Logic} from "./logic/logic";
import {CardbackPickerSerivce} from "./settings/clientOptions_subpages/cardbackPicker.service";

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
    LobbyListPageComponent,
    FriendsPageComponent,
    TabsPage,
    RegistryPageComponent,
    ImpressumPageComponent,
    ClientOptionsPageComponent,
    AchievementListPageComponent,
    AchievementDetailPageComponent,
    LobbyCreationPageComponent,
    CardbackPickerComponent,
    LobbyIngamePageComponent,
    FriendsAddPageComponent,
    LobbyWaitingPageComponent
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
    LobbyListPageComponent,
    FriendsPageComponent,
    TabsPage,
    RegistryPageComponent,
    ImpressumPageComponent,
    ClientOptionsPageComponent,
    AchievementListPageComponent,
    AchievementDetailPageComponent,
    LobbyCreationPageComponent,
    CardbackPickerComponent,
    FriendsAddPageComponent,
    LobbyIngamePageComponent,
    LobbyWaitingPageComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireDatabase,
    AngularFireAuth,
    AuthService,
    ImagePicker,
    ProfileService,
    AchievementService,
    File,
    SubscriptionService,
    LobbyService,
    LocalStorageService,
    GameService,
    FriendsService,
    PlayerService,
    ScreenOrientation,
    Logic,
    CardbackPickerSerivce
  ]
})
export class AppModule {}
