import {Injectable} from '@angular/core';

// requests
import {Http, Response, Headers, RequestOptions, Jsonp, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {environment} from '../../../../environments/environment';

// models
import {User} from "../../models/user";
import {ResponseHandlerService} from "../response-handler/response-handler.service";

@Injectable()
export class AuthenticationService {
    public token: string;
    private apiUrl: string;

    // sets headers for the http requests
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http, private jsonp: Jsonp) {
        // set token if saved in local storage
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;

        this.apiUrl = environment.apiUrl;
    }

    login(user: User): Observable<User> {
        let bodyString = JSON.stringify({name: user.name, username: user.username}); // Stringify payload
        let headers = new Headers({'Content-Type': 'application/json'});// ... Set content type to JSON
        let options = new RequestOptions({headers: headers}); // Create a request option
        const url = `/users`;

        return this.http
            .post(this.apiUrl + url, bodyString, options) // ...using post request
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json() && response.json();
                if (user) {
                    // set token property
                    this.token = user.token;
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({username: user.username, token: this.token, id: user.id}));
                    // return true to indicate successful login
                    return user;
                } else {
                    // return false to indicate failed login
                    return null;
                }
            }) // ...and calling .json() on the response to return data
            .catch(ResponseHandlerService.handleError); //...errors if
    }

    // log out the user from the database
    logout(userId:number): Observable<String> {
        // Create a request option
        let options = new RequestOptions({headers: this.headers});

        const url = `/users/${userId}/logout`;

        // Post request to the server
        return this.http
            .post(this.apiUrl + url,  options)
            .map((response: Response) => {
                this.token = null;
                response.json();
            })
            .catch(ResponseHandlerService.handleError);
    }
}
