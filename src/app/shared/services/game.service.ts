/**
 * Created by nikza on 21.03.2017.
 */
import {Injectable, isDevMode} from '@angular/core';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {Game} from '../models/game';
import {Player} from '../models/player';
import {User} from '../models/user';


@Injectable()
export class GameService {

    private gamesURL = '';

    constructor(private http: Http) {
        if (isDevMode()) {
            // URL for local development
            this.gamesURL = 'http://localhost:8080';
        } else {
            // deployment URL
            this.gamesURL = 'https://sopra-fs17-group09.herokuapp.com';
        }
    }

    // sets headers for the http requests
    private headers = new Headers({'Content-Type': 'application/json'});


    // gets all games that are on the server
    getGames(): Observable<Game[]> {
        return this.http.get(this.gamesURL +'/lobby')
            .map((response: Response) => response.json());
    }

    // gets all players from the specified game
    getPlayers(game:Game):Observable<Player[]>{
        const url = `/${game.id}/players`;
        return this.http.get(this.gamesURL +'/games'+url)
            .map((response: Response) => response.json());
    }

    /** Join an existing game
     *
     * @param game the game the user wants to join
     * @param user
     * @returns void
     */
    joinGame(game:Game, user:User):Observable<Game> {
        let params = new URLSearchParams();
        params.append('gameId',game.id.toString());
        params.append('userId',user.id.toString());

        let bodyString = JSON.stringify({gameId: game.id, userId: user.id});
        let options = new RequestOptions({headers: this.headers, search:params}); // Create a request option

        const url = `/${game.id}`;
        return this.http.post(this.gamesURL+'/lobby'+'/games'+url, bodyString, options)
            .map((response: Response) => response.json());
    }

    /** Creates a new game with a custom name
     *
     * @param user
     * @param gameName:string name of the to be created game
     * @returns {Observable<Game>} the created game
     */
    createGame(user: User, gameName: String): Observable<Game> {
        let params = new URLSearchParams();
        params.append('userId', user.id.toString());
        let bodyString = JSON.stringify({name: gameName, owner: user.username});
        let options = new RequestOptions({headers: this.headers, search:params}); // Create a request option


        return this.http.post(this.gamesURL +'/lobby'+ '/games', bodyString, options)
            .map((response: Response) => {
                let game = response.json() && response.json();
                return game;
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if
    }

    /** Starts a game
     *
     * @param game:Game game object that has to be started
     * @param playerID:number ID of the current player
     * @returns void
     */
    startGame(game:Game, playerID:number): Observable<Game>{
        let params = new URLSearchParams();
        params.append('playerId', playerID.toString());

        let options = new RequestOptions({headers: this.headers, search:params}); // Create a request option

        const url = `/${game.id}/start`;

        return this.http.get(this.gamesURL +'/games'+url, options)
            .map((response: Response) => response.json());
    }
}



