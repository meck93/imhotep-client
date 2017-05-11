import {Injectable} from '@angular/core';

// requests
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

// models
import {Player} from '../../models/player';
import {ResponseHandlerService} from "../response-handler/response-handler.service";
import {Game} from '../../models/game';

@Injectable()
export class WinningScreenService {
    private apiUrl: string;
    public token: string;

    // sets headers for the http requests
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
        this.apiUrl = environment.apiUrl;
    }

    /** GET request
     *  gets a array containing all updated players of the current game
     *
     * @param gameId
     * @returns {Observable<Player[]>}
     */
    getPoints(gameId: number): Observable<Player[]> {
        const url = `/games/${gameId}/players`;
        return this.http.get(this.apiUrl + url)
            .map((response: Response) => response.json());
    }

    deleteGame(game: Game, player: Player): Observable<Game> {
        let params = new URLSearchParams();
        let bodyString = JSON.stringify({});
        

        // Create a request option
        let options = new RequestOptions({headers: this.headers, search: params});

        console.log(player);
        const url = `/lobby/games/${game.id}/players/${player.id}/delete`;

        return this.http
            .post(this.apiUrl + url, bodyString, options)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }
}
