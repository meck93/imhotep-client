import {Injectable} from '@angular/core';

// requests
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

// models
import {MarketPlace} from '../../models/marketPlace';
import {ResponseHandlerService} from "../response-handler/response-handler.service";

@Injectable()
export class MarketPlaceService {
    private apiUrl: string;


    // sets headers for the http requests
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
        this.apiUrl = environment.apiUrl;
    }

    updateMarketCards(gameId: number): Observable<MarketPlace> {
        const url = `/games/${gameId}/sites/MARKET_PLACE`;

        return this.http
            .get(this.apiUrl + url)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }

    createDummyCard(gameId: number,
                    color: string,
                    marketCardType: string): Observable<String> {
        // create request body
        let body = JSON.stringify({
            color: color,
            marketCardType: marketCardType
        });

        // create a request option
        let options = new RequestOptions({headers: this.headers});

        const url = `/games/${gameId}/sites/dummyCard`;

        return this.http
            .post(this.apiUrl + url, body, options)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }
}
