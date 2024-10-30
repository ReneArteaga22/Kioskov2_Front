import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup

  constructor(private apiService:ApiService, private router:Router){
    this.registerForm = new FormGroup({
      nombre: new FormControl('',[Validators.required]),
      apellidos: new FormControl('',[Validators.required]),
      usuario: new FormControl('',[Validators.required]),
      contrasena: new FormControl('',[Validators.required]),
      area: new FormControl('Area',[Validators.required]),
      puesto: new FormControl('',[Validators.required]),
      firma: new FormControl('',[Validators.required]),
      correo: new FormControl('',[Validators.required]),
      telefono: new FormControl('',[Validators.required]),
      foto: new FormControl('',[Validators.required]),
    })
  }

  register(){
    this.apiService.register(this.registerForm.value).subscribe(
      response =>{
        console.log(response)
        this.router.navigate(['/login'])
      }
    )
  }

}
