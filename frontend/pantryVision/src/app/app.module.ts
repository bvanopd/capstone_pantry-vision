import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from '@auth0/auth0-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from "./component/user-list/user-list.component";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule } from "@angular/forms";
import { UserMenuComponent } from './component/user-menu/user-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserMenuComponent
  ],
  imports: [
    BrowserModule,
    AuthModule.forRoot({
      domain: 'dev-vwqjm5rffdafsz1j.us.auth0.com',
      clientId: 'TWGpgZA7UyafhlAgJgMMoDjoIgkiUfAw',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
