import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';

import {AppComponent } from './app.component';
import {AuthGuardService} from "./shared/services/auth-guard.service";
import {UserService} from "./shared/services/user.service";
import {GameService} from "./shared/services/game.service";
import {routing} from "./app.routing";
import {AuthenticationService} from "./shared/services/authentication.service";
import {LoginComponent} from "./login/login.component";
import {GameComponent} from "./game/game.component";
import {LobbyComponent } from './lobby/lobby.component';
import {WinningScreenComponent} from "./winning-screen/winning-screen.component";
import { ShipComponent } from './game/ship/ship.component';
import { MarketPlaceComponent } from './game/market-place/market-place.component';
import { ObeliskComponent } from './game/obelisk/obelisk.component';
import { PyramidComponent } from './game/pyramid/pyramid.component';
import { BurialChamberComponent } from './game/burial-chamber/burial-chamber.component';
import { TempleComponent } from './game/temple/temple.component';
import { HarborComponent } from './game/harbor/harbor.component';
import { SupplySledComponent } from './game/supply-sled/supply-sled.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GameComponent,
    LobbyComponent,
    WinningScreenComponent,
    ShipComponent,
    MarketPlaceComponent,
    ObeliskComponent,
    PyramidComponent,
    BurialChamberComponent,
    TempleComponent,
    HarborComponent,
    SupplySledComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    routing
  ],
  providers: [AuthenticationService,AuthGuardService,UserService, GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
