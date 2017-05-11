import {Injectable} from '@angular/core';

// requests
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {ResponseHandlerService} from "../response-handler/response-handler.service";

// models
import {Player} from '../../models/player';

@Injectable()
export class PlayerService {
    private apiUrl: string;


    constructor(private http: Http) {
        this.apiUrl = environment.apiUrl;
    }

    getPlayer(gameId: number, playerId: number): Observable<Player> {
        const url = `/games/${gameId}/players/${playerId}`;

        return this.http
            .get(this.apiUrl + url)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }
}
