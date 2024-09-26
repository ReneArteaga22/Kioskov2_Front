import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup
  isSubmit: boolean = false

  constructor(){
    this.loginForm = new FormGroup({
      correo: new FormControl('',[Validators.required]),
      contrasena: new FormControl('',[Validators.required])
    })
  }

  login() {
    this.isSubmit = true;
    
    if (this.loginForm.valid) {
      console.log('Formulario válido:', this.loginForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }

}
