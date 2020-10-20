import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import axios from 'axios';


@Component({
  selector: 'app-post-of-users',
  templateUrl: './post-of-users.component.html',
  styleUrls: ['./post-of-users.component.scss']
})
export class PostOfUsersComponent implements OnInit {

  constructor(
    private Http: HttpClient,
    private formBuilder: FormBuilder) {
  }

  ///// comment //////
  get f() {
    return this.commentForm.controls;
  }

  postGeoLoc: string; // geoloc en string nécessite transformation en coordoonnée
  pseudo: string; // pseudo du user
  postTitle: string; // titre du post
  postDescription: string; // description du post
  postImagePath: string; // chemin d'accès pour l'image
  postInsertDate: string; // date d'insertion de l'image en DB
  postId: number; // id user utilisé pour lié les commentaires aux images
  submitted = false;
  isVisible = false;
  isConfirmLoading = false;

  token = sessionStorage.getItem('currentUser');
  decoded = jwt_decode(this.token);
  currentUser = this.decoded.id_user;
  commentForm: FormGroup;
  latitude: number;
  longitude: number;
  visible = false;
  placement = 'bottom';
  isLike = false;
  counto = 0;
  i: number;
  likeArray: any = [];

  commentArray: any = [];
  @Input() postContent; // est utilisé dans home-page-component.ts, il permet de stocker la ligne courante de la DB et permet de l'affiché


  ngOnInit() {
    // console.log(this.objet.insertDate); // DEBUG
    this.postId = this.postContent.id_post;
    this.pseudo = this.postContent.pseudo; // pseudo de l'utilisateur
    this.postTitle = this.postContent.titlePost; // titre du post
    this.postImagePath = this.postContent.imagePath; // url pour l'image
    this.postDescription = this.postContent.description; // description du post
    this.postInsertDate = this.postContent.insertDate;
    this.postGeoLoc = this.postContent.geolocalisation;

    this.queryGetCommentUsers();

    this.Http.get('http://localhost:3000/getLike/' + this.decoded.id_user).subscribe(res => {
      this.likeArray = res;
    });



    sessionStorage.getItem('currentUser');
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.maxLength(255)]]
    });

  }

  private queryGetCommentUsers() {
    this.Http.get('http://localhost:3000/getCommentFromUsers/idPost/' + this.postId).subscribe(res => {
      this.commentArray = res; // stock toute les données de la requete dans un tableau
    });
  }


///// MODAL//////
  showModal(): void {
    this.isVisible = true;
    this.commentForm.reset();
  }

  handleOk(): void {
    if (this.commentForm.valid && this.commentForm.value.comment !== ' ') {
      console.log('la longueur de ce string est de :' + this.commentForm.value.comment);
      this.isConfirmLoading = true;
      setTimeout(() => {
        this.isVisible = true;
        this.isConfirmLoading = false;
        console.log('Button ok clicked!');
        this.queryGetCommentUsers();
        this.commentForm.reset();
      }, 1000);

      console.log(this.postId);
      this.submitted = true;
      const comment = this.commentForm.value.comment;
      const user = this.currentUser;
      console.log('comment => ' + comment);
      this.Http.post('http://localhost:3000/postCommentUser', {
        id_user: user,
        id_image: this.postId,
        commentaire: comment
      })
        .subscribe();
      if (this.commentForm.invalid) {
        return;
      }
    } else {
      alert('vous ne pouvez pas envoyer juste un espace, au  minimum une lettre, un chiffre ou un caractère aux choix');
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    console.log('Button cancel clicked!');
    this.queryGetCommentUsers();
    this.commentForm.reset();
  }


  open(): void {
    this.visible = true;
    console.log('je suis ouvert');
    const lat = this;
    const lgn = this;

    axios

      .get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: this.postGeoLoc,
          key: 'AIzaSyCf-NA1a6uAE7eC56xhgmrMdODR2Os6wI4'

        }
      })
      // tslint:disable-next-line:only-arrow-functions
      .then(function(response) {
        console.log(response);

        lat.latitude = response.data.results[0].geometry.bounds.northeast.lat;

        lgn.longitude = response.data.results[0].geometry.bounds.northeast.lng;
      })
      // tslint:disable-next-line:only-arrow-functions
      .catch(function(error) {
        console.log(error);
      });

    console.log('this.latitude => ' + this.latitude + ' this.longitude => ' + this.longitude);

  }

  close(): void {
    this.visible = false;
    this.commentForm.reset();
  }

  likeMe() {
    this.counto++;
    this.isLike = !this.isLike;

    if (this.counto === 1) {
      this.Http.post('http://localhost:3000/sendLike', {

        user: this.currentUser,
        post: this.postId,
        like: this.isLike
      })
        .subscribe();

    } else {
      this.Http.post('http://localhost:3000/changeLike', {

        user: this.currentUser,
        post: this.postId,
        like: this.isLike
      })
        .subscribe();

    }
  }


}
