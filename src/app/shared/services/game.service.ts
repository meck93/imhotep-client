/**
 * Created by nikza on 21.03.2017.
 */
import {Injectable, isDevMode} from '@angular/core';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {Game} from '../models/game';
import {User} from '../models/user';


@Injectable()
export class GameService {

    private gamesURL = '';

    constructor(private http: Http) {
        if (isDevMode()) {
            this.gamesURL = 'http://localhost:8080';
        } else {
            this.gamesURL = 'https://sopra-fs17-group09.herokuapp.com';
        }
    }


    /*UNCOMMENT FOR LOCAL TESTS*/
    private headers = new Headers({'Content-Type': 'application/json'});


    getGames(): Observable<Game[]> {
        return this.http.get(this.gamesURL +'/lobby')
            .map((response: Response) => response.json());
    }

    joinGame(game:Game, user:User):Observable<Game> {
        let params = new URLSearchParams();
        params.append('gameId',game.id.toString());
        params.append('userId',user.id.toString());

        let bodyString = JSON.stringify({gameId: game.id, userId: user.id});
        let headers = new Headers({'Content-Type': 'application/json'});// ... Set content type to JSON
        let options = new RequestOptions({headers: headers, search:params}); // Create a request option

        const url = `/${game.id}`;
        return this.http.post(this.gamesURL+'/lobby'+'/games'+url, bodyString, options)
            .map((response: Response) => response.json());
    }

    createGame(user: User, gameName: String): Observable<Game> {
        let params = new URLSearchParams();
        params.append('userId', user.id.toString());
        let bodyString = JSON.stringify({name: gameName, owner: user.username});
        let headers = new Headers({'Content-Type': 'application/json'});// ... Set content type to JSON
        let options = new RequestOptions({headers: headers, search:params}); // Create a request option


        return this.http.post(this.gamesURL +'/lobby'+ '/games', bodyString, options)
            .map((response: Response) => {
                let game = response.json() && response.json();
                return game;
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if
    }

    startGame(game:Game, playerID:number): Observable<Game>{
        let params = new URLSearchParams();
        params.append('playerId', playerID.toString());

        let headers = new Headers({'Content-Type': 'application/json'});// ... Set content type to JSON
        let options = new RequestOptions({headers: headers, search:params}); // Create a request option

        const url = `/${game.id}/start`;

        return this.http.post(this.gamesURL +'/games'+url,options)
            .map((response: Response) => response.json());
    }
}



