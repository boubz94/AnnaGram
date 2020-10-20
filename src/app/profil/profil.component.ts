import {Component, Input, OnInit} from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  fileData: File = null;
  previewUrl: any = null;
  isVisible = false;
  isConfirmLoading = false;
  mimeType: any;
  isVisible2 = false;
  isConfirmLoading2 = false;
  submitted = false;
  redirectionImg = ' ';
  solutionImg = true;
  // variables pour le formulaire
  prenom: string;
  nom: string;
  GSM: number;
  profess: string;
  philo: string;
  infoSupp: string;
  photoP: string;
  // tableau pour les photos de l'utilisateur
  arrayPics: any = [];
  // idImg: number;
  i: number;


  constructor(private http: HttpClient) { }

  token = sessionStorage.getItem('currentUser');
  decoded = jwt_decode(this.token);
  helper = new JwtHelperService();

  ngOnInit() {
    this.http.get('http://localhost:3000/userIdentity/' + this.decoded.id_user).subscribe(res => {
      this.photoP = res[0].imageprofil;
      this.prenom = res[0].fname;
      this.nom = res[0].lname;
      this.GSM = res[0].gsm;
      this.infoSupp = res[0].aboutme;
      this.philo = res[0].quote;
      this.profess = res[0].profession;
    });

    this.http.get('http://localhost:3000/getUserImg/' + this.decoded.id_user).subscribe(res => {
      this.arrayPics = res;
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
    };
  }

  // pour le modal --> propriétés ( méthodes)
  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
      this.previewUrl = null;
      this.solutionImg = false;
      this.redirectionImg = imgPp;
    }, 1000);

    const formData = new FormData();
    formData.append('imageFile', this.fileData, this.fileData.name);
    const user = this.decoded.id_user;
    const imgPp = this.fileData.name;
    this.http.post('http://localhost:3000/postImageProfil', { id_user : user, imageprofil : imgPp })
      .subscribe(res => {
        console.log(res);
      });
  }

  handleCancel(): void {
    this.isVisible = false;
    this.previewUrl = null;
  }

// C'est les pramètres pour le deuxième modale qui modifie les données personnelles de l'utilsitateur
  showModal2(): void {
    this.isVisible2 = true;
  }

  // tslint:disable-next-line:variable-name
  handleSave(_event) {
    this.submitted = true;
    const user = this.decoded.id_user;
    this.http.post('http://localhost:3000/postDataUser', {
      lname : this.nom,
      fname : this.prenom,
      profession : this.profess,
      aboutme : this.infoSupp,
      quote : this.philo,
      gsm : this.GSM,
      id_user : user
    })
      .subscribe(res => {
        console.log(res);
      });
    this.isConfirmLoading2 = true;
    setTimeout(() => {
        this.isVisible2 = false;
        this.isConfirmLoading2 = false;
      }, 1000);
  }

  handleQuit(): void {
    this.isVisible2 = false;
  }

  delete(item: any) {
    const index = this.arrayPics.indexOf(item);
    const idpost =  this.arrayPics[index].id_post;
    const user = this.decoded.id_user;
    console.log('voici ce post id de la photo : ' + index + ' et son id post: ' + idpost);
    this.http.post('http://localhost:3000/postDeleteImg', { id_post: idpost, id_user: user})
      .subscribe(res => {
        console.log(res);
      });
    this.arrayPics.splice(index, 1);
  }

}
