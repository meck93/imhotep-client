/**
 * Created by nikza on 21.03.2017.
 */
import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Game } from '../models/game';


@Injectable()
export class GameService {

    constructor(private http: Http) {}
   private gamesURL = 'https://sopra-fs17-group09.herokuapp.com/lobby';  // URL to web api

    /*UNCOMMENT FOR LOCAL TESTS*/
    //private gamesURL = 'http://localhost:8080/lobby';  // URL to web api
    private headers = new Headers({'Content-Type': 'application/json'});


    getGames(): Observable<Game[]> {
        return this.http.get(this.gamesURL)
            .map((response: Response)=> response.json());
    }

}



