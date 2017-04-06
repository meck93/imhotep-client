import {Injectable} from '@angular/core';

// requests
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

// models
import {BuildingSite} from '../../models/buildingSite';

@Injectable()
export class PyramidService {
    private apiUrl: string;

    constructor(private http: Http) {
        this.apiUrl = environment.apiUrl;
    }

    updatePyramidStones(gameId: number): Observable<BuildingSite> {
        const url = `/games/${gameId}/PYRAMID`;
        return this.http.get(this.apiUrl + url)
            .map((response: Response) => response.json());
    }
}
