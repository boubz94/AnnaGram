import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InscriptionComponent} from './inscription/inscription.component';
import {ConnexionComponent} from './connexion/connexion.component';
import {HomePageComponent} from './home-page/home-page.component';
import {ProfilComponent} from './profil/profil.component';
import {InsertImageFormComponent} from './insert-image-form/insert-image-form.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AdminComponent} from './admin/admin.component';


const routes: Routes = [
  {path: 'inscription', component: InscriptionComponent },
  {path: 'connexion', component: ConnexionComponent},
  {path: 'home', component: HomePageComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'profilUser', component: ProfilComponent},
  {path: 'InsertImageUser', component: InsertImageFormComponent},
  {path: '', component: InscriptionComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
