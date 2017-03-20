import { Routes, RouterModule } from '@angular/router';

import {AuthGuardService} from "./shared/services/auth-guard.service";
import {LoginComponent} from "./login/login.component";
import {GameComponent} from "./game/game.component";
import {LobbyComponent} from "./lobby/lobby.component";
import {WinningScreenComponent} from "./winning-screen/winning-screen.component";

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'game', component: GameComponent },
    { path: 'winning-screen', component: WinningScreenComponent},
    { path: 'lobby', component: LobbyComponent, canActivate: [AuthGuardService] },
    {path: '', component:LoginComponent},
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
