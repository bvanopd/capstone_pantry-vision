import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
  constructor(private auth: AuthService) {}
  authenticated: boolean = false;
  private authSub: Subscription;

  ngOnInit(): void {
    // The Auth0 SDK exposes an isAuthenticated$ observable on the AuthService class that allows you to check whether a user is authenticated or not.
    // -- Surely there's a better way to manage user auth status, but for now here we are :)
    this.authSub = this.auth.isAuthenticated$.pipe(take(1)).subscribe(value => this.authenticated = value);
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
  
  login() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({ 
      logoutParams: {
        returnTo: document.location.origin 
      }
    });
  }

}
