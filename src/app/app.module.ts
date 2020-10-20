import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, fr_BE } from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import { NavbarComponent } from './navbar/navbar.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PostOfUsersComponent } from './post-of-users/post-of-users.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfilComponent } from './profil/profil.component';
import { InsertImageFormComponent } from './insert-image-form/insert-image-form.component';
import {AgmCoreModule} from '@agm/core';
import { AdminComponent } from './admin/admin.component';

registerLocaleData(fr);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InscriptionComponent,
    HomePageComponent,
    PostOfUsersComponent,
    ConnexionComponent,
    PageNotFoundComponent,
    ProfilComponent,
    InsertImageFormComponent,
    AdminComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgZorroAntdModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
      AgmCoreModule.forRoot({
        apiKey: 'AIzaSyCf-NA1a6uAE7eC56xhgmrMdODR2Os6wI4'
      })
    ],
  providers: [{ provide: NZ_I18N, useValue: fr_BE }],
  bootstrap: [AppComponent]
})
export class AppModule { }
