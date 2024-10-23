import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup

  constructor(){
    this.registerForm = new FormGroup({
      nombre: new FormControl('',[Validators.required]),
      apellidos: new FormControl('',[]),
      usuario: new FormControl('',[]),
      contrasena: new FormControl('',[]),
      area: new FormControl('',[]),
      puesto: new FormControl('',[]),
      firma: new FormControl('',[]),
      correo: new FormControl('',[]),
      telefono: new FormControl('',[]),
      foto: new FormControl('',[]),
    })
  }

  register(){
    alert('ahsdf')
  }

}
