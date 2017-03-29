import {Injectable, isDevMode} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Ship} from "../models/ship";
import { environment } from '../../../environments/environment';

@Injectable()
export class ShipService {
    private apiUrl: string;

    constructor(private http: Http) {
        this.apiUrl = environment.apiUrl;
    }

    // TODO: Implement place stone method
    placeStone(): Observable<Ship> {

    }

    // TODO: Implement sail ship method
    sailShip(): Observable<Ship> {

    }
}
