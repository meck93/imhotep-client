import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {Game} from '../../models/game';
import {Player} from '../../models/player';
import {Round} from "../../models/round";
import {User} from '../../models/user';
import {environment} from '../../../../environments/environment';

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
            owner: user.username});
        let options = new RequestOptions({headers: this.headers, search:params}); // Create a request option


        return this.http.post(this.apiUrl +'/lobby'+ '/games', bodyString, options)
            .map((response: Response) => {
                let game = response.json() && response.json();
                return game;
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if
    }

    /** Join an existing game
     *
     * @param game the game the user wants to join
     * @param user
     * @returns void
     */
    joinGame(game:Game, user:User):Observable<Game> {
        console.log(game.id);
        console.log(user.id);
        let params = new URLSearchParams();
        params.set('userId', user.id.toString());

        let bodyString = JSON.stringify({});
        let options = new RequestOptions({headers: this.headers, search:params}); // Create a request option

        return this.http.post(this.apiUrl+'/lobby'+'/games'+`/${game.id}`, bodyString, options)
            .map((response: Response) => response.json());
    }

    /** Starts a game
     *
     * @param game:Game game object that has to be started
     * @param playerID:number ID of the current player
     * @returns void
     */
    startGame(game:Game, playerID:number): Observable<Game>{
        let params = new URLSearchParams();
        params.set('playerId', playerID.toString());

        let options = new RequestOptions({headers: this.headers, search:params}); // Create a request option

        const url = `/${game.id}/start`;

        return this.http.get(this.apiUrl +'/games'+url, options)
            .map((response: Response) => response.json());
    }

}
