import {Injectable} from '@angular/core';

// requests
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class MoveService {
  private apiUrl: string;

  // sets headers for the http requests
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
    this.apiUrl = environment.apiUrl;
  }


  getStones(gameId:number, roundNr:number, playerNr:number):Observable<String>{

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

    return this.http.post(this.apiUrl + url, bodyString, options)
        .map((response: Response) => {
          return response.json();
        })
        .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if
  }
}
