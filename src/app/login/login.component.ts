import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../shared/services/authentication.service";
import {Router} from "@angular/router";
import {User} from "../shared/models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';
  user: User;

  constructor(private router: Router, private _service: AuthenticationService, private _router: Router) {

  }

  ngOnInit() {
    // reset login status
    this._service.logout();
    this.user = new User();

  }

  login() {
    this.showLoadingSign();

    this._service.login(this.user)
      .subscribe(result => {
        if (result) {
          this.router.navigate(['/lobby']);
        } else {
          this.error = 'Username exists';
          this.loading = false;
        }
      });
  }

  clearfields() {
    this.user.name = '';
    this.user.username = '';

    this.hideLoadingSign();
  }

  // show laoding sign on the bottom of the login form
  showLoadingSign() {
    let loading = document.getElementById("loading");
    loading.className += " show";
  }

  // hide loading sign on the bottom of the login form
  hideLoadingSign() {
    let loading = document.getElementById("loading");
    loading.className = "";
  }

}
