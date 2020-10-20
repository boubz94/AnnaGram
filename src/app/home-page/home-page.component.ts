import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(
    private  Http: HttpClient,
  ) {
  }

  postContentArray: any = [];


  token = sessionStorage.getItem('currentUser');
  decoded = jwt_decode(this.token);


  ngOnInit() {
    //
    this.Http.get('http://localhost:3000/getPostFromUsers').subscribe(res => {
      this.postContentArray = res; // stock toute les données de la requete dans un tableau
    });
    sessionStorage.getItem('currentUser');
    console.log( this.decoded);
  }

}
