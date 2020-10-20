import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-insert-image-form',
  templateUrl: './insert-image-form.component.html',
  styleUrls: ['./insert-image-form.component.scss']
})
export class InsertImageFormComponent implements OnInit {

  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  // paramètres pour le token
  token = sessionStorage.getItem('currentUser');
  decoded = jwt_decode(this.token);
  helper = new JwtHelperService();
  // variables pour l'insertion de la nouvelle image
  fileData: File = null;
  previewUrl: any = null;
  mimeType: any;
  situation = false;
  // formulaire pour l'ajout de l'image
  insertPicsForm: FormGroup;

  ngOnInit() {
    this.insertPicsForm = this.formBuilder.group({
      titleImg: ['', [Validators.nullValidator]],
      descriptionImg: ['', [Validators.nullValidator]],
      localImg: ['', [Validators.nullValidator]],
    });

  }

  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files[0] as File;
    this.preview();
  }

  preview() {
    // Show preview
    this.mimeType = this.fileData.type;
    if (this.mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    // tslint:disable-next-line:variable-name
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      this.situation = true;
    };
  }

  onSave() {
    const user = this.decoded.id_user;
    const title = this.insertPicsForm.value.titleImg;
    const img = this.fileData.name;
    const descript = this.insertPicsForm.value.descriptionImg;
    const geo = this.insertPicsForm.value.localImg;
    this.http.post('http://localhost:3000/postImgUser', {
      id_user: user,
      titlePost: title,
      imagePath: img,
      description: descript,
      geolocalisation: geo
    })
      .subscribe(res => {
        console.log(res);
      });
    location.href = '/profilUser';
  }

}
