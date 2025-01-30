import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { CBarComponent } from '../../../components/c-bar/c-bar.component';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { DialogModule } from 'primeng/dialog';
import { NgIf } from '@angular/common';
import { CFlechasComponent } from '../../../components/c-flechas/c-flechas.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CBarComponent, DialogModule, NgIf, CFlechasComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup
  visible:boolean = false
  error:boolean =false

  constructor(private apiService:ApiService, private router:Router){
    this.registerForm = new FormGroup({
      nombre: new FormControl('',[Validators.required]),
      apellidos: new FormControl('',[Validators.required]),
      usuario: new FormControl('',[Validators.required]),
      contrasena: new FormControl('',[Validators.required]),
      area: new FormControl('Area',[Validators.required]),
      puesto: new FormControl('',[Validators.required]),
      firma: new FormControl('no'),
      correo: new FormControl('',[Validators.required]),
      telefono: new FormControl('',[Validators.required]),
      foto: new FormControl('no'),
    })
  }

  register(){
    if (this.registerForm.invalid) {
      this.error = true;
      return;
    }
    this.apiService.register(this.registerForm.value).subscribe(
      response =>{
        console.log(response)
        this.visible = true

        setTimeout(() => { 
          this.router.navigate(['/usuarios']); 
          this.visible = false; 
        }, 1600);
      }
    )
  }

}
