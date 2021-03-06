import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AuthGuardService} from "./shared/services/auth-guard/auth-guard.service";
import {GameService} from "./shared/services/game/game.service";
import {routing} from "./app.routing";
import {AuthenticationService} from "./shared/services/authentication/authentication.service";
import {LoginComponent} from "./login/login.component";
import {GameComponent} from "./game/game.component";
import {LobbyComponent} from './lobby/lobby.component';
import {WinningScreenComponent} from "./winning-screen/winning-screen.component";
import {ShipComponent} from './game/ship/ship.component';
import {MarketPlaceComponent} from './game/market-place/market-place.component';
import {ObeliskComponent} from './game/obelisk/obelisk.component';
import {PyramidComponent} from './game/pyramid/pyramid.component';
import {BurialChamberComponent} from './game/burial-chamber/burial-chamber.component';
import {TempleComponent} from './game/temple/temple.component';
import {HarborComponent} from './game/harbor/harbor.component';
import {SupplySledComponent} from './game/supply-sled/supply-sled.component';
import {ScoreBoardComponent} from './game/score-board/score-board.component';
import { SiteShipComponent } from './game/site-ship/site-ship.component';
import {DndModule} from "ng2-dnd";
import {DragulaModule} from "ng2-dragula";
import { PlayerCardsComponent } from './game/player-cards/player-cards.component';
import { SiteHarborComponent } from './game/site-harbor/site-harbor.component';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NotificationBoardComponent } from './game/notification-board/notification-board.component';
import { HintsComponent } from './hints/hints.component';

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
        SupplySledComponent,
        ScoreBoardComponent,
        SiteShipComponent,
        PlayerCardsComponent,
        SiteHarborComponent,
        NotificationBoardComponent,
        HintsComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        routing,
        DndModule.forRoot(),
        DragulaModule,
        Ng2OrderModule
    ],
    providers: [AuthenticationService, AuthGuardService, GameService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
