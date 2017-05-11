import {Injectable} from '@angular/core';

// requests
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs";
import {environment} from '../../../../environments/environment';

// models
import {Ship} from '../../models/ship';
import {ResponseHandlerService} from "../response-handler/response-handler.service";

@Injectable()
export class ShipService {
    private apiUrl: string;

    constructor(private http: Http) {
        // get api URL to either get data from the local host or the heroku server
        this.apiUrl = environment.apiUrl;
    }

    getShip(gameId: number, roundNumber: number, shipId: number): Observable<Ship> {
        const url = `/games/${gameId}/rounds/${roundNumber}/ships/${shipId}`;

        return this.http
            .get(this.apiUrl + url)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }
}
