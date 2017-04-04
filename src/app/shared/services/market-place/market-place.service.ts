import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {MarketPlace} from '../../models/marketPlace';
import { environment } from '../../../../environments/environment';

@Injectable()
export class MarketPlaceService {
  private apiUrl:string;

  constructor(private http: Http) {
    this.apiUrl = environment.apiUrl;
  }

  private headers = new Headers({'Content-Type': 'application/json'});


  updateMarketCards(gameId:number):Observable<MarketPlace>{
    return this.http.get(this.apiUrl +'/games/'+`${gameId}`+ '/MARKET_PLACE')
        .map((response: Response) => response.json());
  }
}
