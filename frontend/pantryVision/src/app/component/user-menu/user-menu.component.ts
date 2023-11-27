import { Component } from '@angular/core';
import { UserService } from "../../service/user.service";
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
  constructor(private userService: UserService, private auth: AuthService) {}
  authenticated: boolean;
  isLoading: boolean;
  user$ = this.auth.user$;

  ngOnInit(): void {
    const loadingSub = this.auth.isLoading$.subscribe(loading => {
      this.isLoading = loading;
      if (!this.isLoading) {
        loadingSub.unsubscribe();
      }
    });
    const authSub = this.auth.isAuthenticated$.subscribe(status => {
      this.authenticated = status;
      if (!this.isLoading) {
        authSub.unsubscribe();
      }
    });
  }
  login(): void {
    this.auth.loginWithRedirect();
  }
  logout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: document.location.origin
      }
    });
  }
}
