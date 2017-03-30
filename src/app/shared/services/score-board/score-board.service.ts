import {Injectable, isDevMode} from '@angular/core';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { environment } from '../../../../environments/environment';

import {Player} from '../../models/player';




@Injectable()
export class ScoreBoardService {

  private apiUrl:string;

  constructor(private http: Http) {
    this.apiUrl = environment.apiUrl;
  }

  // sets headers for the http requests
  private headers = new Headers({'Content-Type': 'application/json'});


  /** GET request
   *  gets a array containing all updated players of the current game
   *
   * @param gameId
   * @returns {Observable<Player[]>}
   */
  updatePoints(gameId:number): Observable<Player[]> {
    return this.http.get(this.apiUrl +'/games' + `/${gameId}`)
        .map((response: Response) => response.json());
  }

}
