import {Injectable} from '@angular/core';

// requests
import {Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

// services
import {ResponseHandlerService} from "../response-handler/response-handler.service";

// models
import {User} from '../../models/user';
import {Game} from '../../models/game';

@Injectable()
export class LobbyService {
    private apiUrl: string;

    // sets headers for the http requests
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
        this.apiUrl = environment.apiUrl;
    }

    /** Creates a new game with a custom name
     *
     * @param user
     * @param gameName:string name of the to be created game.old
     * @returns {Observable<Game>} the created game
     */
    createGame(user: User, gameName: String): Observable<Game> {
        let params = new URLSearchParams();
        params.append('userId', user.id.toString());

        let bodyString = JSON.stringify({
            name: gameName,
            owner: user.username
        });

        // Create a request option
        let options = new RequestOptions({headers: this.headers, search: params});

        const url = `/lobby/games`;

        return this.http
            .post(this.apiUrl + url, bodyString, options)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }

    /** Join an existing game
     *
     * @param game the game the user wants to join
     * @param user
     */
    joinGame(game: Game, user: User): Observable<Game> {
        let params = new URLSearchParams();
        params.set('userId', user.id.toString());

        let bodyString = JSON.stringify({});

        // Create a request option
        let options = new RequestOptions({headers: this.headers, search: params});

        const url = `/lobby/games/${game.id}`;

        return this.http
            .post(this.apiUrl + url, bodyString, options)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }

    /** Leave the joined game.
     *
     * @param gameId
     * @param playerId
     */
    leaveGame(gameId: number, playerId: number): Observable<String> {
        const url = `/lobby/games/${gameId}/players/${playerId}/delete`;

        // create a request option
        let options = new RequestOptions({headers: this.headers});

        return this.http.post(this.apiUrl + url, options)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }

    /** Starts a game
     *
     * @param game:Game game object that has to be started
     * @param playerID:number ID of the current player
     */
    startGame(game: Game, playerID: number): Observable<Game> {
        let params = new URLSearchParams();
        params.set('playerId', playerID.toString());

        let bodyString = JSON.stringify({});

        // Create a request option
        let options = new RequestOptions({headers: this.headers, search: params});

        const url = `/lobby/games/${game.id}/start`;

        return this.http
            .post(this.apiUrl + url, bodyString, options)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }

    fastForward(gameId: number, playerId: number): Observable<string> {
        let params = new URLSearchParams();
        params.set('playerId', playerId.toString());

        let bodyString = JSON.stringify({});

        // Create a request option
        let options = new RequestOptions({headers: this.headers, search: params});

        const url = `/lobby/games/${gameId}/fastforward`;

        return this.http
            .post(this.apiUrl + url, bodyString, options)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }
}
