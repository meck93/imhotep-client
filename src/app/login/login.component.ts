import {Component, OnInit, ElementRef} from '@angular/core';

// services
import {AuthenticationService} from "../shared/services/authentication/authentication.service";

// models
import {Router} from "@angular/router";
import {User} from "../shared/models/user";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    // component fields
    loading = false;
    error = '';
    user: User;

    errorMessage: string;

    constructor(private router: Router,
                private _service: AuthenticationService,
                private _router: Router,
                private myElement: ElementRef) {

    }
    // *************************************************************
    // MAIN FUNCTIONS
    // *************************************************************

    ngOnInit() {
        this.user = new User();
        localStorage.clear();
    }

    login() {
        this.showLoadingSign();

        // primitive login restriction
        //if (this.user.name.match("alschei|meck|nzaugg")) {
        this._service.login(this.user)
            .subscribe(result => {
                if (result) {
                    this.router.navigate(['/lobby']);
                }
            }, error => this.errorMessage = "This username already exists. Please try another one.");
        //}
        this.hideLoadingSign();
    }

    // *************************************************************
    // HELPER FUNCTIONS FOR UI
    // *************************************************************

    clearfields() {
        this.user.username = '';
        this.errorMessage = '';

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

    // checks if the input field for the user name is empty
    isUserNameEmpty() {
        return this.myElement.nativeElement.querySelector('#user-name').value == "";
    }

    // checks length of user name
    checkUserName(newValue) {
        if (newValue.length > 15) {
            this.errorMessage = "This username is too long! Please choose a shorter one.";
        } else {
            this.errorMessage = "";
        }
    }
}
