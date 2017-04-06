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
export class GameService {
    private apiUrl:string;

    // sets headers for the http requests
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
        this.apiUrl = environment.apiUrl;
    }

    // gets all games that are on the server
    getGames(): Observable<Game[]> {
        const url = `/lobby`;

        return this.http.get(this.apiUrl + url)
            .map((response: Response) => response.json());
    }

    getGame(game:Game): Observable<Game>{
        const url = `/games/${game.id}`;

        return this.http.get(this.apiUrl + url)
            .map((response: Response) => response.json());
    }

    // gets all players from the specified game
    getPlayers(game:Game):Observable<Player[]>{
        const url = `/games/${game.id}/players`;

        return this.http.get(this.apiUrl + url)
            .map((response: Response) => response.json());
    }

    createDummyStones(gameId:number): Observable<String>{
        // Create a request option
        let options = new RequestOptions({headers: this.headers});

        const url = `/games/${gameId}/sites/dummy`;

        return this.http.post(this.apiUrl + url, options)
            .map((response: Response) => {
                let string = response.json() && response.json();
                return string;
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if
    }

}
