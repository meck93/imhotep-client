import {Injectable} from '@angular/core';

// requests
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import { environment } from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

// models
import {BuildingSite} from '../../models/buildingSite';
import {ResponseHandlerService} from "../response-handler/response-handler.service";

@Injectable()
export class TempleService {
  private apiUrl:string;

  constructor(private http: Http) {
    this.apiUrl = environment.apiUrl;
  }

  updateTempleStones(gameId:number):Observable<BuildingSite>{
    const url = `/games/${gameId}/sites/TEMPLE`;

    return this.http
        .get(this.apiUrl + url)
        .map(ResponseHandlerService.extractData)
        .catch(ResponseHandlerService.handleError);
  }
}
