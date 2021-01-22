import { APP_INITIALIZER, NgModule, NgZone } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

function initializeKeycloak(keycloak: KeycloakService, ngZone: NgZone) {
  return () => new Promise((resolve, reject) =>
    ngZone.runOutsideAngular(() =>
      keycloak.init({
        config: {
          url: 'http://localhost:8080/auth',
          realm: 'master',
          clientId: 'keycloak-angular',
        },
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        },
      })
        .then(resolve)
        .catch(reject)
    ));
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    KeycloakAngularModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, NgZone],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
