import {Injectable, isDevMode} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Ship} from "../models/ship";

@Injectable()
export class ShipService {
    private apiUrl: string;

    constructor(private http: Http) {
        if (isDevMode()) {
            this.apiUrl = 'http://localhost:8080';
        } else {
            this.apiUrl = 'https://sopra-fs17-group09.herokuapp.com';
        }
    }

    // TODO: Implement place stone method
    placeStone(): Observable<Ship> {

    }

    // TODO: Implement sail ship method
    sailShip(): Observable<Ship> {

    }
}
