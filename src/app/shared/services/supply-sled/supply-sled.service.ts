import {Injectable} from '@angular/core';

// models
import {Player} from '../../models/player';

// requests
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class SupplySledService {
    private apiUrl: string;

    constructor(private http: Http) {
        this.apiUrl = environment.apiUrl;
    }

  updateSupplySledStones(gameId: number, playerId: number): Observable<Player> {
    const url = `/games/${gameId}/players/${playerId}`;

    return this.http.get(this.apiUrl + url)
      .map((response: Response) => response.json());
  }
}
