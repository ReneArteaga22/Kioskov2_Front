import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { CookieService } from 'ngx-cookie-service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup
  isSubmit: boolean = false
  galletas: string = 'galleta'
  error:boolean = false


  constructor(private router:Router, private apiService:ApiService, private galleta:CookieService){
    this.loginForm = new FormGroup({
      uids: new FormControl('',[Validators.required]),
      contrasena: new FormControl('',[Validators.required])
    })
  }

  login(){
    console.log(this.loginForm.value)
    if(!this.isSubmit && this.loginForm.valid){
      this.apiService.login(this.loginForm.value).subscribe(
        response =>{
          console.log(response)
          this.galleta.set('area', response.usuario.area)
          this.galleta.set('sesion','1')
          this.router.navigate(['/'])
        },error => {
          if(error.status === 404 || 500){
            this.error = true
          }
        }
      )
    }
  }
}
