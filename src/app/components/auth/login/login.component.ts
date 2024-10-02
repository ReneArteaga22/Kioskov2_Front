import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';

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

  constructor(private router:Router, private apiService:ApiService
  ){
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
          console.log("Inicio de seion extiso",response)
          this.router.navigate(['/'])
        }
      )
    }else{
      console.log('no se pudo')
    }
  }
}
