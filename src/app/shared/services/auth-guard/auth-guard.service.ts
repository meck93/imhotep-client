import { Injectable } from '@angular/core';
import {CanActivate, Router} from "@angular/router";

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate() {
    if (localStorage.getItem('currentUser')) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page
    this.router.navigate(['/login']);
    return false;
  }
}
