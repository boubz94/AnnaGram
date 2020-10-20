import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
  }


  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      Pseudo: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    const name = this.registerForm.value.lastName;
    const fisrtname = this.registerForm.value.firstName;
    const pseudo = this.registerForm.value.Pseudo;
    const mail = this.registerForm.value.email;
    const pass = this.registerForm.value.password;
    // tslint:disable-next-line:max-line-length
    this.http.post('http://localhost:3000/postInscriptionUser', {
      name1: name,
      name2: fisrtname,
      pseud: pseudo,
      maill: mail,
      passworde: pass
    })
      .subscribe();
    if (this.registerForm.invalid) {
      return;
    } else {
      alert('vous êtes bien inscrit !');
      location.href = '/connexion';
    }
  }


}

