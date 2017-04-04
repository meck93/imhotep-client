import {Injectable, isDevMode} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs";
import {MOCKSHIPS} from '../../models/mock-ships';

import {environment} from '../../../../environments/environment';

import {Ship} from '../../models/ship';
import {Round} from '../../models/Round';

@Injectable()
export class ShipService {
    private apiUrl: string;

    constructor(private http: Http) {
        // get api URL to either get data from the local host or the heroku server
        this.apiUrl = environment.apiUrl;
    }

    // set headers for the http requests
    private headers = new Headers({'Content-Type': 'application/json'});

    // TODO: delete as soon as service works properly with data from /games/{id}/rounds/{id}/ships/{id}
    getShips(): Ship[] {
        // get current game
        let game = JSON.parse(localStorage.getItem('currentGame'));

        // get current round
        let roundNumber = game.roundCounter;

        // get current rounds
        let rounds:Round[] = game.rounds;

        // get current round
        let round:Round = rounds[roundNumber-1];

        // return ships of this round
        //let ships:Ship[] = round.ships;
        //return round.ships;

        console.log("before ships");

        //console.log(round.ships[0]);
        let ships:Ship[] = MOCKSHIPS;
        console.log("after ships");
        return ships;
    }

    getRound(gameId:number, roundNumber:Number): Observable<Round> {
        return this.http.get(this.apiUrl +'/games' + `/${gameId}` + "/rounds" + `/${roundNumber}`)
            .map((response: Response) => response.json());
    }
}
