import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { CookieService } from 'ngx-cookie-service';
import { NgIf } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CBarComponent } from '../../../components/c-bar/c-bar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, RouterLink, NgIf, DialogModule, CBarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  loginForm: FormGroup
  isSubmit: boolean = false
  galletas: string = 'galleta'
  error:boolean = false
  visible:boolean = false


  constructor(private router:Router, private apiService:ApiService, private galleta:CookieService){
    this.loginForm = new FormGroup({
      uids: new FormControl('',[Validators.required]),
      contrasena: new FormControl('',[Validators.required])
    })
  }

  login(){
    if(!this.isSubmit && this.loginForm.valid){
      this.apiService.login(this.loginForm.value).subscribe(
        response =>{
          this.galleta.set('area', response.usuario.area)                       
          this.galleta.set('sesion','1')
          this.galleta.set('user_id',response.usuario.id)
          this.visible = true

          setTimeout(() => { 
            this.router.navigate(['/']); 
            this.visible = false; 
          }, 1600);
          
        },error => {
          if(error.status === 404 || 500){
            this.error = true
          }
        }
      )
    }
  }
}
