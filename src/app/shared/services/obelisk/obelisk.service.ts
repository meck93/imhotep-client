import {Injectable, isDevMode} from '@angular/core';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {BuildingSite} from '../../models/buildingSite';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ObeliskService {
  private apiUrl:string;

  constructor(private http: Http) {
    this.apiUrl = environment.apiUrl;
  }

  private headers = new Headers({'Content-Type': 'application/json'});


  updateObeliskStones(gameId:number):Observable<BuildingSite>{
    return this.http.get(this.apiUrl +'/games/'+`${gameId}`+ '/OBELISK')
        .map((response: Response) => response.json());
  }
}