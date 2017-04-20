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

@Injectable()
export class ScoreBoardService {
    private apiUrl: string;

    constructor(private http: Http) {
        this.apiUrl = environment.apiUrl;
    }

    /** GET request
     *  gets a array containing all updated players of the current game
     *
     * @param gameId
     * @returns {Observable<Player[]>}
     */
    updatePoints(gameId: number): Observable<Player[]> {
        const url = `/games/${gameId}/players`;
        return this.http
            .get(this.apiUrl + url)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }
}
