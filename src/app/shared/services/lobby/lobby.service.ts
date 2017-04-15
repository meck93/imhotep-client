import {Injectable} from '@angular/core';

// requests
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

// models
import {User} from '../../models/user';
import {Player} from '../../models/player';
import {Game} from '../../models/game';
import {Round} from "../../models/round";

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

        return this.http.post(this.apiUrl + url, bodyString, options)
            .map((response: Response) => {
                let game = response.json() && response.json();
                return game;
            })
            .catch(this.handleError);
    }

    /** Join an existing game
     *
     * @param game the game the user wants to join
     * @param user
     * @returns void
     */
    joinGame(game: Game, user: User): Observable<Game> {
        let params = new URLSearchParams();
        params.set('userId', user.id.toString());

        let bodyString = JSON.stringify({});

        // Create a request option
        let options = new RequestOptions({headers: this.headers, search: params});

        const url = `/lobby/games/${game.id}`;

        return this.http.post(this.apiUrl + url, bodyString, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
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

        return this.http.post(this.apiUrl + url, bodyString, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        //console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
