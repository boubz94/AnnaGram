import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private Http: HttpClient) {
  }

  userArray: any = [];
  postArray: any = [];
  commentArray: any = [];

  ngOnInit() {
    this.queryGetUsers();
    this.queryGetPost();

  }

  private queryGetUsers() {
    this.Http.get('http://localhost:3000/utilisateursForAdmin').subscribe(res => {
      this.userArray = res;
      // console.log(this.userArray);
    });
  }


  private queryGetPost() {
    this.Http.get('http://localhost:3000/postForAdmin').subscribe(res => {
      this.postArray = res;
      console.log(this.postArray);
    });
  }
  private getComment(id_post: any) {
    this.Http.get('http://localhost:3000/getCommentFromUsersForAdmin/idPost/' + id_post).subscribe(res => {
      // console.log(res);
      this.commentArray = res; // stock toute les données de la requete dans un tableau
      console.log(this.commentArray);
    });
  }

  deleteUser(item: any) {
    console.log('user num=>' + item);
    const index = this.userArray.indexOf(item);
    this.Http.post('http://localhost:3000/deleteUser', {id_user: item}).subscribe(res => {
      console.log(res);
    });
    this.userArray.splice(index, 1);
  }

  deletePost(item: any) {
    console.log('post num=>' + item);
    const index = this.postArray.indexOf(item);
    this.Http.post('http://localhost:3000/deletepost', {id_post: item}).subscribe(res => {
      console.log(res);
    });
    this.postArray.splice(index, 1);
  }
  deleteComment(item: any) {
    console.log('comment num=>' + item);
    const index = this.commentArray.indexOf(item);
    this.Http.post('http://localhost:3000/deleteComment', {id_comment: item.id_comment}).subscribe(res => {
      console.log(res);
    });
    console.log('comment index=>' + index);
    this.commentArray.splice(index, 1);
  }

  checkComment(id_post: any) {
    this.open();
    this.getComment(id_post);

  }



  visible = false;
  placement = 'right';
  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
