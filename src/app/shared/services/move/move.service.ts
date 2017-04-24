import {Injectable} from '@angular/core';

// requests
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {MarketCard} from "../../models/market-card";
import {ResponseHandlerService} from "../response-handler/response-handler.service";

@Injectable()
export class MoveService {
    private apiUrl: string;

    // sets headers for the http requests
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
        this.apiUrl = environment.apiUrl;
    }

    // get stones for stone quarry
    getStones(gameId: number, roundNr: number, playerNr: number): Observable<String> {
        let bodyString = JSON.stringify({
            gameId: gameId,
            roundNr: roundNr,
            playerNr: playerNr,
            type: "GET_STONES",
            "moveType": "GET_STONES"
        });

        // Create a request option
        let options = new RequestOptions({headers: this.headers});

        const url = `/games/${gameId}/rounds/${roundNr}/moves`;

        return this.http
            .post(this.apiUrl + url, bodyString, options)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }

    // place stone on  a ship
    placeStone(gameId: number, roundNr: number, playerNr: number, shipId: number, placeOnShip: number): Observable<String> {
        // create request body
        let body = JSON.stringify({
            gameId: gameId,
            roundNr: roundNr,
            playerNr: playerNr,
            shipId: shipId,
            placeOnShip: placeOnShip,
            type: "PLACE_STONE",
            "moveType": "PLACE_STONE"
        });

        // create request option
        let options = new RequestOptions({headers: this.headers});

        // create request url
        const url = `/games/${gameId}/rounds/${roundNr}/moves`;

        return this.http
            .post(this.apiUrl + url, body, options)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }

    sailShipToSite(gameId: number, roundNr: number, playerNr: number, shipId: number, targetSiteId: number): Observable<String> {
        // create request body
        let body = JSON.stringify({
            gameId: gameId,
            roundNr: roundNr,
            playerNr: playerNr,
            shipId: shipId,
            targetSiteId: targetSiteId,
            type: "SAIL_SHIP",
            "moveType": "SAIL_SHIP"
        });

        // create request option
        let options = new RequestOptions({headers: this.headers});

        // create request url
        const url = `/games/${gameId}/rounds/${roundNr}/moves`;

        return this.http
            .post(this.apiUrl + url, body, options)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }

    getCard(gameId: number, roundNr: number, playerNr: number,
            cardId: number): Observable<string> {
        // create request body
        let body = JSON.stringify({
            type: "GET_CARD",
            gameId: gameId,
            roundNr: roundNr,
            playerNr: playerNr,

            "moveType": "GET_CARD",
            marketCardId: cardId
        });

        // create request option
        let options = new RequestOptions({headers: this.headers});

        // create request url
        const url = `/games/${gameId}/rounds/${roundNr}/moves`;

        return this.http
            .post(this.apiUrl + url, body, options)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }

    playMarketCard(gameId: number, roundNr: number, body): Observable<String> {
        // create request option
        let options = new RequestOptions({headers: this.headers});
        // create request url
        const url = `/games/${gameId}/rounds/${roundNr}/moves`;

        return this.http
            .post(this.apiUrl + url, body, options)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }

    playMarketCard_HAMMER(gameId: number, roundNr: number, playerNr: number,
                          cardId: number, cardType: string,
                          shipId: number, placeOnShip: number): Observable<string> {
        // create request body
        let body = JSON.stringify({
            type: "PLAY_CARD",
            gameId: gameId,
            roundNr: roundNr,
            playerNr: playerNr,

            cardId: cardId,
            "moveType": cardType,

            shipId: shipId,
            placeOnShip: placeOnShip,

        });

        return this.playMarketCard(gameId, roundNr, body);
    }

    playMarketCard_CHISEL(gameId: number, roundNr: number, playerNr: number,
                          cardId: number, cardType: string,
                          shipId: number, placeOnShip: number,
                          shipId2: number, placeOnShip2: number): Observable<string> {
        // create request body
        let body = JSON.stringify({
            type: "PLAY_CARD",
            gameId: gameId,
            roundNr: roundNr,
            playerNr: playerNr,

            cardId: cardId,
            "moveType": cardType,

            shipId: shipId,
            placeOnShip: placeOnShip,

            shipId2: shipId2,
            placeOnShip2: placeOnShip2,

        });

        return this.playMarketCard(gameId, roundNr, body);
    }

    playMarketCard_SAIL(gameId: number, roundNr: number, playerNr: number,
                        cardId: number, cardType: string,
                        shipId: number, placeOnShip: number,
                        targetSiteId: number): Observable<string> {
        // create request body
        let body = JSON.stringify({
            type: "PLAY_CARD",
            gameId: gameId,
            roundNr: roundNr,
            playerNr: playerNr,

            cardId: cardId,
            "moveType": cardType,

            shipId: shipId,
            placeOnShip: placeOnShip,

            targetSiteId: targetSiteId
        });

        return this.playMarketCard(gameId, roundNr, body);
    }

    playMarketCard_LEVER(gameId: number, roundNr: number, playerNr: number,
                         cardId: number, cardType: string,
                         shipId: number, shipOrder: number[],
                         targetSiteId: number): Observable<string> {
        // create request body
        let body = JSON.stringify({
            type: "PLAY_CARD",
            gameId: gameId,
            roundNr: roundNr,
            playerNr: playerNr,

            cardId: cardId,
            "moveType": cardType,

            shipId: shipId,
            unloadingOrder: shipOrder,

            targetSiteId: targetSiteId
        });

        return this.playMarketCard(gameId, roundNr, body);
    }
}
