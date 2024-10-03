import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css'
})
export class RecuperarContrasenaComponent {

  recuperarForm:FormGroup

  constructor(){
    this.recuperarForm = new FormGroup({
      correo: new FormControl('',[Validators.required]),
      contrasena: new FormControl('',[Validators.required]),
    })
  }

  recuperar(){
    alert('recuperando')
  }
}
