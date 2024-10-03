import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup
  isSubmit: boolean = false
  galletas: string = 'galleta'

  constructor(private router:Router, private apiService:ApiService, private galleta:CookieService
  ){
    this.loginForm = new FormGroup({
      correo: new FormControl('',[Validators.required]),
      contrasena: new FormControl('',[Validators.required])
    })
  }
  login(){
  
    console.log(this.loginForm.value)
    if(!this.isSubmit && this.loginForm.valid){
      this.apiService.login(this.loginForm.value).subscribe(
        response =>{
          this.galleta.set(response.rol,'area')
          this.router.navigate(['/'])
        }
      )
    }else{
      console.log('no se pudo')
    }
  }
}
