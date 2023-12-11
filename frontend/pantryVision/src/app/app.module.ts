import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from '@auth0/auth0-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from "./component/user-list/user-list.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule } from "@angular/forms";
import { UserMenuComponent } from './component/user-menu/user-menu.component';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { PantryComponent } from './component/pantry/pantry.component';
import { HeaderComponent } from './component/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { KitchenComponent } from './component/kitchen/kitchen.component';
import { AngularSplitModule } from "angular-split";
import { RecipeComponent } from './component/recipe/recipe/recipe.component';
import { RecipeDetailsComponent } from './component/recipe-details-component/recipe-details.component';
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserMenuComponent,
    PantryComponent,
    HeaderComponent,
    KitchenComponent,
    RecipeComponent,
    RecipeDetailsComponent
  ],
  imports: [
    BrowserModule,
    AuthModule.forRoot({
      // domain and clientId are not sensitive information
      domain: 'dev-vwqjm5rffdafsz1j.us.auth0.com',
      clientId: 'TWGpgZA7UyafhlAgJgMMoDjoIgkiUfAw',
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: "http://localhost:8080/api/", // audience identifier set up on Auth0 dashboard, and not called by Auth0
      },
      httpInterceptor: {
        // Any calls to the backend which require authorization must have their paths listed in the allowedList
        allowedList: [
          "/api/private",
          "/api/user/getPantry.do",
          "/api/user/setPantry.do",
        ]
      }
    }),
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatProgressBarModule,
    MatButtonModule,
    AngularSplitModule,
    MatDialogModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
