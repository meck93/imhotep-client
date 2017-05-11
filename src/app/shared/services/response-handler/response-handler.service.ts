import { Injectable } from '@angular/core';

// requests
import {Response} from "@angular/http";
import {Observable} from "rxjs";


@Injectable()
export class ResponseHandlerService {

  constructor() { }

  // extract data from request response
  static extractData(res: Response) {
    let body;

    // check if response is empty, before call json
    if (res.text()) {
      body = res.json();
    }

    return body || {};
  }

  // handle request error
  static handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    //console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
