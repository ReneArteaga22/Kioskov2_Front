import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CBarComponent } from '../../../components/c-bar/c-bar.component';
@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule,CBarComponent],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css'
})
export class RecuperarContrasenaComponent {

  error: string = '';
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
