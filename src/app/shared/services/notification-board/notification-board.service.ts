import { Injectable } from '@angular/core';

// requests
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

// models
import {} from '../../models/player';
import {ResponseHandlerService} from "../response-handler/response-handler.service";
import {Page} from "../../models/page";

@Injectable()
export class NotificationBoardService {

  private apiUrl: string;

  // sets headers for the http requests
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
    this.apiUrl = environment.apiUrl;
  }

  /** GET request
   *  gets a array containing the game log messages of the current game
   *
   * @param gameId
   * @returns {Observable<XXXX[]>}
   */
  updateGameLog(gameId: number): Observable<Page> {
    let params = new URLSearchParams();
    params.append('numberOfMoves', "4");

    // Create a request option
    let options = new RequestOptions({headers: this.headers, search: params});

    const url = `/games/${gameId}/moves`;
    return this.http
        .get(this.apiUrl + url, options)
        .map(ResponseHandlerService.extractData)
        .catch(ResponseHandlerService.handleError);
  }
}
