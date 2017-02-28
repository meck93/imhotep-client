import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';

import { AppComponent } from './app.component';
import {AuthGuardService} from "./shared/services/auth-guard.service";
import {UserService} from "./shared/services/user.service";
import {routing} from "./app.routing";
import {AuthenticationService} from "./shared/services/authentication.service";
import {LoginComponent} from "./login/login.component";
import {GameComponent} from "./game/game.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    routing
  ],
  providers: [AuthenticationService,AuthGuardService,UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
