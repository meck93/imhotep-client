import {Injectable} from '@angular/core';


// requests
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {ResponseHandlerService} from "../response-handler/response-handler.service";

@Injectable()
export class QuarryService {
    private apiUrl: string;


    constructor(private http: Http) {
        this.apiUrl = environment.apiUrl;
    }

    getQuarry(gameId: number, playerNumber: number): Observable<number> {
        const url = `/games/${gameId}/stoneQuarry/${playerNumber}`;

        return this.http
            .get(this.apiUrl + url)
            .map(ResponseHandlerService.extractData)
            .catch(ResponseHandlerService.handleError);
    }

}
