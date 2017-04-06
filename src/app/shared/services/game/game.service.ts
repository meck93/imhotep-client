import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {Game} from '../../models/game';
import {Player} from '../../models/player';
import {Round} from "../../models/round";
import {User} from '../../models/user';
import { environment } from '../../../../environments/environment';

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
        return this.http.get(this.apiUrl +'/lobby')
            .map((response: Response) => response.json());
    }

    getGame(game:Game): Observable<Game>{
        return this.http.get(this.apiUrl +'/games'+`/${game.id}`)
            .map((response: Response) => response.json());
    }

    // gets all players from the specified game
    getPlayers(game:Game):Observable<Player[]>{
        const url = `/${game.id}/players`;
        return this.http.get(this.apiUrl +'/games'+url)
            .map((response: Response) => response.json());
    }

    createDummyStones(gameId:number): Observable<String>{
        let options = new RequestOptions({headers: this.headers}); // Create a request option
        return this.http.post(this.apiUrl +'/games'+`/${gameId}/dummy`, options)
            .map((response: Response) => {
                let string = response.json() && response.json();
                return string;
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if
    }

}
