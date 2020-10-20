import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  connexionForm: FormGroup;


  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
  }


  // declaration
  url = 'http://localhost:3000/getDataConnexion';
  @Input() dataUser;


  ngOnInit(): void {
    this.connexionForm = this.formBuilder.group({
      pseudo: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
    sessionStorage.clear();
  }

  onSubmit() {

    this.http.post<any>(this.url, {pseudo: this.connexionForm.value.pseudo, pass: this.connexionForm.value.password}).subscribe(
      res => {
        const token = res.token;
        sessionStorage.setItem('currentUser', token);


        if (this.connexionForm.value.pseudo === 'admin' && this.connexionForm.value.password === 'admin') {
          location.href = '/admin';
        } else {
          location.href = '/home';
        }
        console.log(token);

        location.href = '/home';

      },
      () => { }
    );
  }

}






