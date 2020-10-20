import {Component, OnInit} from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private  Http: HttpClient) {
  }

  connectOrNot: string;
  co: boolean;
  token = sessionStorage.getItem('currentUser');
  decoded = jwt_decode(this.token);
  idUser: number;
  arrayPseudo: any = [];
  pseudo: string;
  helper = new JwtHelperService();
  myJSON: string;


  ngOnInit() {
    this.pseudo = this.decoded.pseudo;
    this.Http.get('http://localhost:3000/userPseudo/' + this.idUser).subscribe(res => {
      this.arrayPseudo = res; // stock toute les données de la requete dans un tableau
    });
  }

  changePath() {
    if (this.co) {
      this.connectOrNot = 'connexion';
    } else {
      this.connectOrNot = 'deconnexion';
    }
  }

  isclicked($click) {
    this.changePath();
    this.co = true;
  }
}
