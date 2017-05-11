import {Injectable} from '@angular/core';

// requests
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {environment} from '../../../../environments/environment';
import {Observable} from "rxjs";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// models
import {Player} from '../../models/player';
import {Game} from '../../models/game';
import {ResponseHandlerService} from "../response-handler/response-handler.service";

@Injectable()
export class GameService {
    private apiUrl: string;

    // sets headers for the http requests
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
        this.apiUrl = environment.apiUrl;
    }

    // gets all games that are on the server
    getGames(): Observable<Game[]> {
        const url = `/lobby`;

        return this.http
            .get(this.apiUrl + url)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }

    getGame(game: Game): Observable<Game> {
        const url = `/games/${game.id}`;

        return this.http
            .get(this.apiUrl + url)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }

    getGameFromId(gameId: number): Observable<Game> {
        const url = `/games/${gameId}`;

        return this.http
            .get(this.apiUrl + url)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }

    // gets all players from the specified game
    getPlayers(game: Game): Observable<Player[]> {
        const url = `/games/${game.id}/players`;

        return this.http
            .get(this.apiUrl + url)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }
}
